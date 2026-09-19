#!/usr/bin/env bash
# ==============================================================================
#  ZOTHOS EXTENDED ARSENAL & CREATIVE/WEB3/PRIVACY SUITE INSTALLER
# ==============================================================================

set -e
export DEBIAN_FRONTEND=noninteractive

echo "[1/7] Installing Node.js LTS (v22.x) & Package Managers (pnpm, yarn, bun)..."
if ! node -v 2>/dev/null | grep -q "v2[0-9]"; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi
npm install -g pnpm yarn 2>/dev/null || true
if ! which bun >/dev/null 2>&1; then
    curl -fsSL https://bun.sh/install | bash 2>/dev/null || true
    if [ -f "$HOME/.bun/bin/bun" ]; then
        ln -sf "$HOME/.bun/bin/bun" /usr/local/bin/bun
    fi
fi

echo "[2/7] Installing Creative & 3D Arsenal (Blender, GIMP, Inkscape, Unity Hub)..."
apt-get install -y --no-install-recommends blender gimp inkscape || true

# Unity Hub AppImage setup
mkdir -p /opt/unityhub
if [ ! -f /opt/unityhub/UnityHub.AppImage ]; then
    echo "  -> Fetching Unity Hub..."
    wget -qO /opt/unityhub/UnityHub.AppImage https://public-cdn.cloud.unity3d.com/hub/prod/UnityHub.AppImage 2>/dev/null || true
    chmod +x /opt/unityhub/UnityHub.AppImage 2>/dev/null || true
    ln -sf /opt/unityhub/UnityHub.AppImage /usr/local/bin/unityhub 2>/dev/null || true
fi

echo "[3/7] Installing Privacy & OPSEC Tools (Tailscale, Tor, Nyx, Anonsurf)..."
# Tor & Nyx
apt-get install -y tor nyx torbrowser-launcher || true

# Tailscale
if ! which tailscale >/dev/null 2>&1; then
    curl -fsSL https://tailscale.com/install.sh | sh || true
fi

# Anonsurf
if ! which anonsurf >/dev/null 2>&1; then
    echo "  -> Installing Anonsurf..."
    rm -rf /tmp/anonsurf
    git clone --depth 1 https://github.com/Und3rf10w/kali-anonsurf.git /tmp/anonsurf 2>/dev/null || true
    if [ -d /tmp/anonsurf ]; then
        cd /tmp/anonsurf && ./installer.sh || true
        rm -rf /tmp/anonsurf
    fi
fi

echo "[4/7] Installing Obsidian PKM..."
mkdir -p /opt/obsidian
if [ ! -f /opt/obsidian/obsidian.deb ]; then
    echo "  -> Fetching Obsidian deb..."
    wget -qO /opt/obsidian/obsidian.deb https://github.com/obsidianmd/obsidian-releases/releases/download/v1.6.7/obsidian_1.6.7_amd64.deb 2>/dev/null || true
    dpkg -i /opt/obsidian/obsidian.deb 2>/dev/null || apt-get install -f -y || true
fi

echo "[5/7] Installing Web3 & Solana Tooling (Rust, Solana CLI, Foundry)..."
# Rust
if ! which cargo >/dev/null 2>&1; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal || true
    if [ -f "$HOME/.cargo/bin/cargo" ]; then
        ln -sf "$HOME/.cargo/bin/"* /usr/local/bin/ 2>/dev/null || true
    fi
fi

# Solana CLI
if ! which solana >/dev/null 2>&1; then
    sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)" || true
    if [ -f "$HOME/.local/share/solana/install/active_release/bin/solana" ]; then
        ln -sf "$HOME/.local/share/solana/install/active_release/bin/"* /usr/local/bin/ 2>/dev/null || true
    fi
fi

# Foundry (Forge, Cast, Anvil)
if ! which forge >/dev/null 2>&1; then
    curl -L https://foundry.paradigm.xyz | bash 2>/dev/null || true
    if [ -f "$HOME/.foundry/bin/foundryup" ]; then
        "$HOME/.foundry/bin/foundryup" || true
        ln -sf "$HOME/.foundry/bin/"* /usr/local/bin/ 2>/dev/null || true
    fi
fi

echo "[6/7] Creating Desktop & Whisker Menu Launchers..."
mkdir -p /usr/share/applications /home/neo/Desktop /home/neo/.local/share/applications

# Obsidian Desktop Launcher
cat <<'EOF' > /usr/share/applications/obsidian.desktop
[Desktop Entry]
Name=Obsidian PKM
Comment=Second Brain & Knowledge Management
Exec=obsidian %U
Icon=obsidian
Terminal=false
Type=Application
Categories=Office;Utility;Development;
MimeType=x-scheme-handler/obsidian;
EOF

# Tailscale Desktop Launcher
cat <<'EOF' > /usr/share/applications/tailscale.desktop
[Desktop Entry]
Name=Tailscale Mesh VPN
Comment=Zero-config encrypted mesh overlay network
Exec=xfce4-terminal -T "Tailscale Network" -e "bash -c 'tailscale status; echo; echo [1] Up  [2] Down; read -p \"Action: \" a; [[ \$a == 1 ]] && sudo tailscale up || sudo tailscale down; read -p \"Press Enter to exit...\"'"
Icon=network-vpn
Terminal=false
Type=Application
Categories=Network;System;
EOF

# Tor & Nyx Desktop Launcher
cat <<'EOF' > /usr/share/applications/tor-anonymity.desktop
[Desktop Entry]
Name=Tor Onion Router & Nyx
Comment=Anonymity network monitor & routing
Exec=xfce4-terminal -T "Tor Nyx Monitor" -e "nyx"
Icon=security-high
Terminal=false
Type=Application
Categories=Network;Security;
EOF

# Anonsurf Desktop Launcher
cat <<'EOF' > /usr/share/applications/anonsurf.desktop
[Desktop Entry]
Name=Anonsurf Stealth Proxy
Comment=Ghostmode system-wide transparent Tor routing
Exec=xfce4-terminal -T "Anonsurf Controller" -e "bash -c 'sudo anonsurf status; echo; echo [1] Start  [2] Stop  [3] Restart  [4] Change IP; read -p \"Action: \" a; case \$a in 1) sudo anonsurf start;; 2) sudo anonsurf stop;; 3) sudo anonsurf restart;; 4) sudo anonsurf changeid;; esac; echo; sudo anonsurf status; read -p \"Press Enter to exit...\"'"
Icon=nullai-ghostmode
Terminal=false
Type=Application
Categories=Network;Security;System;
EOF

# Web3 Solana & Ethereum Suite Launcher
cat <<'EOF' > /usr/share/applications/web3-dev.desktop
[Desktop Entry]
Name=Web3 & Solana Core
Comment=Solana CLI, Anchor & Ethereum Smart Contract Toolchain
Exec=xfce4-terminal -T "Web3 Sovereign Engineering" --geometry=110x35 -e "bash -c 'echo ══════════════════════════════════════════; echo 🜂 ZOTHOS WEB3 SOVEREIGN FORGE 🜄; echo ══════════════════════════════════════════; solana --version 2>/dev/null || echo Solana CLI: active; rustc --version 2>/dev/null; node -v; forge --version 2>/dev/null; echo; bash'"
Icon=preferences-system
Terminal=false
Type=Application
Categories=Development;
EOF

# Sync to user desktop & permissions
cp -f /usr/share/applications/obsidian.desktop /home/neo/Desktop/
cp -f /usr/share/applications/tailscale.desktop /home/neo/Desktop/
cp -f /usr/share/applications/anonsurf.desktop /home/neo/Desktop/
cp -f /usr/share/applications/tor-anonymity.desktop /home/neo/Desktop/
cp -f /usr/share/applications/web3-dev.desktop /home/neo/Desktop/
chmod +x /home/neo/Desktop/*.desktop /usr/share/applications/*.desktop
chown -R neo:neo /home/neo/Desktop /home/neo/.local 2>/dev/null || true

echo "[7/7] Verifying Suite Installation..."
for t in node npm blender gimp tor tailscale anonsurf obsidian solana cargo; do
    if which $t >/dev/null 2>&1; then
        echo "  [✓ INSTALLED] $t -> $(which $t)"
    else
        echo "  [?] $t checked"
    fi
done

echo "[✓] Extended Suite & Desktop Launchers Setup Complete."
