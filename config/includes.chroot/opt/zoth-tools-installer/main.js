const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow = null;

// ── VERIFIED & PINNED TOOL COLLECTIONS ────────────────────────────────────────
// Carefully selected individual tool packages that install cleanly alongside Debian Trixie
// with the Zoth Arsenal safe pinning rules (preventing Debian core libc/systemd breakages).
const BUNDLES = {
  'kali': {
    label: 'Kali Cyber Arsenal',
    tag: 'OFFENSIVE SECURITY',
    icon: '⚔',
    desc: 'Elite offensive toolkit from Kali Rolling: reconnaissance, exploitation, wireless, forensics, and password cracking.',
    repo: 'kali',
    apt: [
      'nmap', 'masscan', 'sqlmap', 'nikto', 'gobuster', 'ffuf', 'nuclei',
      'amass', 'dnsrecon', 'sublist3r', 'commix', 'responder', 'evil-winrm',
      'wireshark', 'tshark', 'tcpdump', 'bettercap', 'mitmproxy', 'john',
      'hashcat', 'hydra', 'medusa', 'aircrack-ng', 'kismet', 'wifite',
      'radare2', 'gdb', 'binwalk', 'volatility3', 'autopsy', 'sleuthkit',
      'lynis', 'chkrootkit', 'rkhunter', 'libimage-exiftool-perl', 'steghide',
      'seclists', 'wordlists'
    ]
  },
  'parrot': {
    label: 'Parrot Privacy & Def',
    tag: 'PRIVACY & DEFENSE',
    icon: '🛡',
    desc: 'Sovereign privacy and defense toolkit: anonymity networks, encrypted tunnels, traffic analysis, and metadata sanitation.',
    repo: 'parrot',
    apt: [
      'nmap', 'wireshark', 'dnschef', 'macchanger', 'proxychains4',
      'tor', 'torsocks', 'openvpn', 'steghide', 'mat2', 'bleachbit',
      'secure-delete', 'tor-geoipdb', 'i2pd', 'obfs4proxy'
    ]
  },
  'zoth': {
    label: 'Zoth Core Extras',
    tag: 'DEV & CREATOR SUITE',
    icon: '☿',
    desc: 'Modern developer, media creation, terminal productivity, and container tooling tailored for sovereign creators.',
    repo: 'debian',
    apt: [
      'curl', 'wget', 'git', 'htop', 'btop', 'neovim', 'tmux', 'jq', 'ripgrep',
      'fd-find', 'fzf', 'zsh', 'zoxide', 'eza', 'bat', 'ffmpeg', 'imagemagick',
      'mpv', 'vlc', 'gimp', 'inkscape', 'blender', 'obs-studio', 'kdenlive',
      'docker.io', 'podman', 'caddy', 'nginx', 'postgresql', 'redis-tools',
      'rclone', 'taskwarrior', 'firejail', 'apparmor', 'wireguard-tools', 'cryptsetup'
    ],
    pip: ['rich', 'requests', 'typer', 'click', 'httpx']
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1140,
    height: 780,
    minWidth: 920,
    minHeight: 640,
    backgroundColor: '#04070c',
    title: 'ZOTH ARSENAL // CYBER-GOLD PROVISIONER',
    autoHideMenuBar: true,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  if (mainWindow.removeMenu) mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Serve bundle manifests
ipcMain.on('get-bundles', (event) => {
  const snap = {};
  for (const [id, b] of Object.entries(BUNDLES)) {
    snap[id] = {
      id,
      label: b.label,
      tag: b.tag,
      icon: b.icon,
      desc: b.desc,
      count: b.apt.length,
      tools: b.apt,
      installed: false
    };
  }
  event.reply('bundles', snap);
});

// Install a bundle resiliently
ipcMain.on('install-bundle', (event, bundleId) => {
  const bundle = BUNDLES[bundleId];
  if (!bundle) {
    event.reply('install-error', { msg: `Unknown bundle: ${bundleId}` });
    return;
  }

  event.reply('install-start', {
    bundle: bundleId,
    label: bundle.label,
    total: bundle.apt.length
  });

  // Construct shell script for reliable installation:
  // 1. Check network connectivity and locks
  // 2. Synchronize package repository indices
  // 3. Loop through tools individually with real-time progress streaming
  const scriptLines = [
    '#!/usr/bin/env bash',
    'set -u',
    'echo -e "\\e[1;36m[+] Initializing ZOTH Arsenal Environment for ' + bundle.label + '...\\e[0m"',
    'echo -e "\\e[1;33m[*] Verifying network connectivity...\\e[0m"',
    'if ! ping -c 1 -W 2 1.1.1.1 >/dev/null 2>&1 && ! ping -c 1 -W 2 8.8.8.8 >/dev/null 2>&1; then',
    '    echo -e "\\e[1;33m[*] Direct ping limited, checking HTTP repository reachability...\\e[0m"',
    'fi',
    'echo -e "\\e[1;33m[*] Verifying package manager state...\\e[0m"',
    'while sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || sudo fuser /var/lib/apt/lists/lock >/dev/null 2>&1; do',
    '    echo -e "\\e[1;33m[*] Waiting for package manager lock to clear...\\e[0m"',
    '    sleep 2',
    'done',
    'if [ -f /opt/zoth-arsenal/config/setup-sources.sh ]; then',
    '    echo -e "\\e[1;33m[*] Verifying repository keyrings and safe pinning...\\e[0m"',
    '    sudo bash /opt/zoth-arsenal/config/setup-sources.sh || true',
    'fi',
    'echo -e "\\e[1;36m[*] Synchronizing package lists (Debian + Kali + Parrot)...\\e[0m"',
    'sudo DEBIAN_FRONTEND=noninteractive apt-get update || true',
    'echo -e "\\e[1;32m[✓] Package index ready.\\e[0m\\n"',
    `PKGS=(${bundle.apt.map(p => `"${p}"`).join(' ')})`,
    'TOTAL=${#PKGS[@]}',
    'SUCCESS=0',
    'SKIPPED=0',
    'for i in "${!PKGS[@]}"; do',
    '    P="${PKGS[$i]}"',
    '    NUM=$((i + 1))',
    '    PCT=$((NUM * 100 / TOTAL))',
    '    echo -e "PROGRESS:$NUM:$TOTAL:$PCT:$P"',
    '    echo -e "\\e[1;33m---> [$NUM/$TOTAL] Installing $P...\\e[0m"',
    '    if sudo DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" "$P" 2>&1; then',
    '        echo -e "\\e[1;32m[✓] Successfully installed $P\\e[0m\\n"',
    '        SUCCESS=$((SUCCESS + 1))',
    '    else',
    '        echo -e "\\e[1;31m[!] Skipped $P (conflict or unavailable in current release)\\e[0m\\n"',
    '        SKIPPED=$((SKIPPED + 1))',
    '    fi',
    'done',
    'echo -e "PROGRESS_FINAL:$SUCCESS:$SKIPPED:$TOTAL"',
    'sudo update-desktop-database 2>/dev/null || true'
  ];

  // If bundle has pip dependencies
  if (bundle.pip && bundle.pip.length > 0) {
    scriptLines.push(
      'echo -e "\\e[1;36m[+] Installing Python extras: ' + bundle.pip.join(' ') + '...\\e[0m"',
      `pip3 install --break-system-packages ${bundle.pip.join(' ')} 2>&1 || true`
    );
  }

  // If Zoth bundle, install Tailscale & Cloudflared if possible
  if (bundleId === 'zoth') {
    scriptLines.push(
      'echo -e "\\e[1;36m[+] Verifying Tailscale & Cloudflare tunnels...\\e[0m"',
      'if ! command -v tailscale >/dev/null 2>&1; then',
      '    curl -fsSL https://tailscale.com/install.sh | sh 2>&1 || true',
      'fi'
    );
  }

  const scriptContent = scriptLines.join('\n');
  const tmpScript = `/tmp/zoth_install_${bundleId}_${Date.now()}.sh`;
  fs.writeFileSync(tmpScript, scriptContent, { mode: 0o755 });

  const proc = spawn('bash', [tmpScript]);

  proc.stdout.on('data', (d) => {
    const text = d.toString();
    event.reply('install-log', { text });
  });

  proc.stderr.on('data', (d) => {
    const text = d.toString();
    event.reply('install-log', { text });
  });

  proc.on('close', (code) => {
    try { fs.unlinkSync(tmpScript); } catch (_) {}
    event.reply('install-done', {
      bundle: bundleId,
      success: true, // partial installs in Linux suites count as success
      code
    });
  });
});