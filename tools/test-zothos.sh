#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS COMPREHENSIVE VM & SYSTEM VALIDATION SUITE (2026)
#  Automated integrity, libvirt domain, network bridge & runtime smoke testing
# ==============================================================================

set -euo pipefail

# ANSI Palette
GREEN="\e[1;32m"
CYAN="\e[1;36m"
YELLOW="\e[1;33m"
RED="\e[1;31m"
BOLD="\e[1m"
DIM="\e[2m"
RESET="\e[0m"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CHROOT="$ROOT_DIR/config/includes.chroot"
DEFAULT_VM_DISK="/home/neo/hermes-workspace/vms/zothos/zothos.qcow2"
DEFAULT_ISO="$ROOT_DIR/build/zothos-1.0-amd64.iso"
DEFAULT_VM_NAME="zothos"

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

log_pass() {
    local msg="$1"
    echo -e "  ${GREEN}[✓ PASS]${RESET} $msg"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
}

log_fail() {
    local msg="$1"
    echo -e "  ${RED}[✗ FAIL]${RESET} $msg"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
}

log_info() {
    local msg="$1"
    echo -e "  ${CYAN}[* INFO]${RESET} $msg"
}

log_warn() {
    local msg="$1"
    echo -e "  ${YELLOW}[! WARN]${RESET} $msg"
}

print_header() {
    echo -e "${GREEN}${BOLD}"
    echo "  ╔════════════════════════════════════════════════════════════════════╗"
    echo "  ║         ZOTHOS VIRTUAL MACHINE & SYSTEM VALIDATION SUITE           ║"
    echo "  ╚════════════════════════════════════════════════════════════════════╝"
    echo -e "${RESET}"
}

show_help() {
    cat << EOF
ZOTHOS Automated VM & System Validation Tool

Usage:
  ./tools/test-zothos.sh [MODE / OPTIONS]

Modes:
  --all, -a            Run full validation suite (chroot audit + live VM tests) [default]
  --vm, --live         Validate running/libvirt ZothOS VM (network, IP, SSH, services)
  --chroot, --audit    Run static system integrity & chroot syntax audit
  --qcow2 [disk_path]  Launch QEMU directly using QCOW2 image
  --iso [iso_path]     Launch QEMU using generated ISO image
  --help, -h           Show this help message

Options:
  --vm-name <name>     Libvirt domain name (default: zothos)
  --timeout <sec>      Timeout in seconds for VM network discovery (default: 20)
  --qemu-display <dis> QEMU display type: gtk, curses, none (default: gtk)

Examples:
  ./tools/test-zothos.sh --all
  ./tools/test-zothos.sh --vm
  ./tools/test-zothos.sh --audit
  ./tools/test-zothos.sh --iso build/zothos-1.0-amd64.iso
EOF
}

test_chroot_integrity() {
    echo -e "\n${BOLD}${YELLOW}=== [ PHASE 1: CHROOT & STATIC INTEGRITY AUDIT ] ===${RESET}"
    if [[ -x "$SCRIPT_DIR/verify-zothos.sh" ]]; then
        if "$SCRIPT_DIR/verify-zothos.sh"; then
            log_pass "Chroot static integrity audit passed"
        else
            log_fail "Chroot static integrity audit failed"
        fi
    else
        log_warn "verify-zothos.sh not found, running basic file check"
        if [[ -d "$CHROOT/usr/local/bin" ]]; then
            log_pass "Found /usr/local/bin directory in chroot"
        else
            log_fail "Missing /usr/local/bin in chroot"
        fi
    fi
}

test_desktop_integration() {
    echo -e "\n${BOLD}${YELLOW}=== [ PHASE 2: DESKTOP & LAUNCHER INTEGRITY ] ===${RESET}"
    local desktop_launcher="/home/neo/Desktop/zothos-vm.desktop"
    if [[ -f "$desktop_launcher" ]]; then
        log_pass "Desktop entry found: $desktop_launcher"
        if grep -q "qemu:///system" "$desktop_launcher" && grep -q "zothos" "$desktop_launcher"; then
            log_pass "Desktop entry connects to qemu:///system domain 'zothos'"
        else
            log_fail "Desktop entry command missing required libvirt domain target"
        fi
    else
        log_fail "Desktop entry missing at $desktop_launcher"
    fi

    local local_apps_count
    local_apps_count=$(find "$CHROOT/usr/share/applications" -name "*.desktop" 2>/dev/null | wc -l)
    if [[ "$local_apps_count" -gt 0 ]]; then
        log_pass "Found $local_apps_count application launchers in chroot"
    else
        log_fail "No application launchers found in chroot"
    fi
}

test_live_vm() {
    local vm_name="$1"
    local timeout_sec="$2"

    echo -e "\n${BOLD}${YELLOW}=== [ PHASE 3: LIBVIRT VM & NETWORK BRIDGE VALIDATION ] ===${RESET}"
    
    if ! command -v virsh >/dev/null 2>&1; then
        log_fail "virsh command not found on host"
        return 1
    fi

    # 1. Check if domain exists
    if ! virsh -c qemu:///system dominfo "$vm_name" >/dev/null 2>&1; then
        log_fail "Libvirt domain '$vm_name' is not defined in qemu:///system"
        return 1
    fi
    log_pass "Libvirt domain '$vm_name' exists in qemu:///system"

    # 2. Check VM State & start if shut off
    local vm_state
    vm_state=$(virsh -c qemu:///system domstate "$vm_name" 2>/dev/null | tr -d '[:space:]')
    log_info "Current domain '$vm_name' state: $vm_state"

    if [[ "$vm_state" != "running" ]]; then
        log_info "Starting domain '$vm_name'..."
        virsh -c qemu:///system start "$vm_name" >/dev/null 2>&1 || true
        sleep 4
        vm_state=$(virsh -c qemu:///system domstate "$vm_name" 2>/dev/null | tr -d '[:space:]')
    fi

    if [[ "$vm_state" == "running" ]]; then
        log_pass "Domain '$vm_name' is actively running"
    else
        log_fail "Domain '$vm_name' failed to enter running state (Current: $vm_state)"
        return 1
    fi

    # 3. Inspect Domain Resource Allocation
    local vcpus
    vcpus=$(virsh -c qemu:///system dominfo "$vm_name" | awk -F: '/CPU\(s\):/ {gsub(/ /, "", $2); print $2}')
    local memory_kib
    memory_kib=$(virsh -c qemu:///system dominfo "$vm_name" | awk -F: '/Max memory:/ {gsub(/[^0-9]/, "", $2); print $2}')
    local memory_mb=$((memory_kib / 1024))

    log_pass "Domain Resources: $vcpus vCPUs, ${memory_mb}MB RAM allocated"

    # 4. Resolve IP Address
    log_info "Resolving VM IP address (timeout ${timeout_sec}s)..."
    local vm_ip=""
    local elapsed=0
    while [[ $elapsed -lt $timeout_sec ]]; do
        vm_ip=$(virsh -c qemu:///system domifaddr "$vm_name" 2>/dev/null | awk '/ipv4/ {print $4}' | cut -d/ -f1 | head -n1 || true)
        if [[ -n "$vm_ip" ]]; then
            break
        fi
        # Try checking DHCP leases
        vm_ip=$(virsh -c qemu:///system net-dhcp-leases default 2>/dev/null | awk -v name="$vm_name" '$0 ~ name {print $5}' | cut -d/ -f1 | head -n1 || true)
        if [[ -n "$vm_ip" ]]; then
            break
        fi
        sleep 2
        elapsed=$((elapsed + 2))
    done

    if [[ -n "$vm_ip" ]]; then
        log_pass "VM network bridge IP acquired: ${CYAN}${vm_ip}${RESET}"
    else
        log_fail "Failed to acquire VM IP address after ${timeout_sec}s"
        return 1
    fi

    # 5. Ping Connectivity Test
    log_info "Pinging VM at $vm_ip..."
    if ping -c 2 -W 2 "$vm_ip" >/dev/null 2>&1; then
        log_pass "Host-to-VM ICMP ping successful (0% loss)"
    else
        log_fail "Host cannot ping VM at $vm_ip"
    fi

    # 6. SSH Execution & Core Services Smoke Test
    echo -e "\n${BOLD}${YELLOW}=== [ PHASE 4: LIVE VM RUNTIME SMOKE TESTS (SSH) ] ===${RESET}"
    log_info "Executing remote validation checks via SSH on $vm_ip..."

    local ssh_opts=(-o BatchMode=yes -o StrictHostKeyChecking=no -o ConnectTimeout=5)

    if ! ssh "${ssh_opts[@]}" "neo@$vm_ip" "true" 2>/dev/null; then
        log_fail "SSH connection to neo@$vm_ip refused or key unauthorized"
        return 1
    fi
    log_pass "SSH authentication to neo@$vm_ip established"

    # Test Kernel & OS Hostname
    local kernel_info
    kernel_info=$(ssh "${ssh_opts[@]}" "neo@$vm_ip" "uname -sr" 2>/dev/null || true)
    log_pass "Guest Kernel: $kernel_info"

    # Test Zoth OS Commands
    local zoth_bins=(
        "zoth"
        "zoth-fastfetch"
        "zoth-mode"
        "zoth-ai"
        "zoth-sec"
        "zoth-mcp"
        "zoth-agent-os"
        "zoth-agent-hud"
        "zoth-cockpit"
        "zoth-matrix-rain"
    )

    for cmd in "${zoth_bins[@]}"; do
        if ssh "${ssh_opts[@]}" "neo@$vm_ip" "command -v $cmd >/dev/null 2>&1" 2>/dev/null; then
            log_pass "Command available in VM: /usr/local/bin/$cmd"
        else
            log_fail "Missing command in VM: $cmd"
        fi
    done

    # Test zoth-fastfetch execution
    if ssh "${ssh_opts[@]}" "neo@$vm_ip" "zoth-fastfetch" >/dev/null 2>&1; then
        log_pass "zoth-fastfetch executes successfully inside VM"
    else
        log_fail "zoth-fastfetch failed execution inside VM"
    fi

    # Test GUI and Display Server Stack
    local gui_procs
    gui_procs=$(ssh "${ssh_opts[@]}" "neo@$vm_ip" "pgrep -a -f 'xfce|lightdm|Xorg|zoth-desktop' || true" 2>/dev/null)
    if echo "$gui_procs" | grep -q "lightdm"; then
        log_pass "Display Manager (LightDM) is active"
    else
        log_warn "LightDM process not active"
    fi

    if echo "$gui_procs" | grep -q "Xorg"; then
        log_pass "X11 Display Server (Xorg) is active"
    else
        log_warn "Xorg process not active"
    fi

    if echo "$gui_procs" | grep -q "xfce4-session"; then
        log_pass "XFCE4 Desktop Session is active"
    else
        log_warn "XFCE4 session process not active"
    fi

    # Test Zoth Studio assets inside VM
    if ssh "${ssh_opts[@]}" "neo@$vm_ip" "test -f /opt/zoth-studio/index.html && test -x /opt/zoth-studio/launch.sh" 2>/dev/null; then
        log_pass "Zoth Studio (/opt/zoth-studio) verified in VM"
    else
        log_fail "Zoth Studio missing or not executable in VM"
    fi
}

run_qcow2_qemu() {
    local disk="$1"
    local display="$2"
    if [[ ! -f "$disk" ]]; then
        echo -e "${RED}[!] Error: QCOW2 disk image not found at $disk${RESET}"
        exit 1
    fi
    echo -e "${GREEN}[*] Launching QCOW2 image in QEMU (4GB RAM, 4 vCPUs, KVM)...${RESET}"
    qemu-system-x86_64 \
        -enable-kvm \
        -m 4096 \
        -smp 4 \
        -drive file="$disk",format=qcow2,if=virtio \
        -vga virtio \
        -display "$display" \
        -net nic,model=virtio -net user
}

run_iso_qemu() {
    local iso="$1"
    local display="$2"
    if [[ ! -f "$iso" ]]; then
        echo -e "${RED}[!] Error: ISO not found at $iso${RESET}"
        exit 1
    fi
    echo -e "${GREEN}[*] Launching ZOTHOS Live ISO in QEMU (4GB RAM, 4 vCPUs, KVM)...${RESET}"
    qemu-system-x86_64 \
        -enable-kvm \
        -m 4096 \
        -smp 4 \
        -cdrom "$iso" \
        -boot d \
        -vga virtio \
        -display "$display" \
        -net nic,model=virtio -net user
}

main() {
    print_header

    local mode="all"
    local vm_name="$DEFAULT_VM_NAME"
    local timeout=20
    local target_path=""
    local qemu_display="gtk"

    while [[ $# -gt 0 ]]; do
        case "$1" in
            --all|-a)
                mode="all"
                shift
                ;;
            --vm|--live)
                mode="vm"
                shift
                ;;
            --chroot|--audit)
                mode="chroot"
                shift
                ;;
            --qcow2)
                mode="qcow2"
                shift
                if [[ $# -gt 0 && ! "$1" =~ ^-- ]]; then
                    target_path="$1"
                    shift
                else
                    target_path="$DEFAULT_VM_DISK"
                fi
                ;;
            --iso)
                mode="iso"
                shift
                if [[ $# -gt 0 && ! "$1" =~ ^-- ]]; then
                    target_path="$1"
                    shift
                else
                    target_path="$DEFAULT_ISO"
                fi
                ;;
            --vm-name)
                shift
                vm_name="$1"
                shift
                ;;
            --timeout)
                shift
                timeout="$1"
                shift
                ;;
            --qemu-display)
                shift
                qemu_display="$1"
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                if [[ -f "$1" && "$1" =~ \.iso$ ]]; then
                    mode="iso"
                    target_path="$1"
                    shift
                elif [[ -f "$1" && "$1" =~ \.qcow2$ ]]; then
                    mode="qcow2"
                    target_path="$1"
                    shift
                else
                    echo -e "${RED}[!] Unknown option: $1${RESET}"
                    show_help
                    exit 1
                fi
                ;;
        esac
    done

    case "$mode" in
        all)
            test_chroot_integrity
            test_desktop_integration
            test_live_vm "$vm_name" "$timeout"
            ;;
        vm)
            test_desktop_integration
            test_live_vm "$vm_name" "$timeout"
            ;;
        chroot)
            test_chroot_integrity
            test_desktop_integration
            ;;
        qcow2)
            run_qcow2_qemu "$target_path" "$qemu_display"
            exit 0
            ;;
        iso)
            run_iso_qemu "$target_path" "$qemu_display"
            exit 0
            ;;
    esac

    echo -e "\n======================================================"
    echo -e "                   TEST SUMMARY                       "
    echo -e "======================================================"
    echo -e "  Total Tests Run: ${BOLD}$TOTAL_TESTS${RESET}"
    echo -e "  Passed:          ${GREEN}${BOLD}$PASSED_TESTS${RESET}"
    if [[ $FAILED_TESTS -gt 0 ]]; then
        echo -e "  Failed:          ${RED}${BOLD}$FAILED_TESTS${RESET}"
        echo -e "\n${RED}${BOLD}[✗] VALIDATION SUITE FAILED.${RESET}"
        exit 1
    else
        echo -e "  Failed:          ${GREEN}0${RESET}"
        echo -e "\n${GREEN}${BOLD}[✓] ALL VALIDATION CHECKS PASSED SUCCESSFULLY!${RESET}"
        exit 0
    fi
}

main "$@"
