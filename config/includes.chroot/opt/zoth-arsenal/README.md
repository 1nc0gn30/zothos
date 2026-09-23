# 🜂 ZOTH ARSENAL
> The Sovereign Security, Pentesting, AI Red Teaming & Web3 Tool Registry for ZOTHOS Linux.

Zoth Arsenal unifies the finest offensive security, OSINT, and privacy suites from **Kali Linux** and **Parrot OS** with **Frontier AI Red Teaming** and **Web3 Security** toolchains into a sovereign, version-controlled repository.

---

## ⚡ Quick Start

```bash
# Clone the Zoth Arsenal registry
git clone https://github.com/1nc0gn30/zoth-arsenal.git ~/.zoth-arsenal

# Set up Kali and Parrot sources with safe Debian Trixie pinning
sudo bash ~/.zoth-arsenal/config/setup-sources.sh

# Install any tool or full suite
zoth install kali-top10
zoth install anonsurf
zoth install ai-stack
```

---

## 🛡️ Tool Categories & Coverage

| Category | Suite Source | Highlights |
|---|---|---|
| **01. Information Gathering** | Kali & Parrot | `nmap`, `masscan`, `rustscan`, `amass`, `theharvester`, `dnsrecon` |
| **02. Vulnerability Analysis** | Kali & Parrot | `nikto`, `nuclei`, `lynis`, `unix-privesc-check`, `yersinia` |
| **03. Web Application Security** | Kali & Parrot | `burpsuite`, `sqlmap`, `commix`, `ffuf`, `feroxbuster`, `wpscan` |
| **04. Password & Auth Attacks** | Kali & Parrot | `john`, `hashcat`, `hydra`, `medusa`, `crunch`, `wordlists` |
| **05. Wireless & RF Attacks** | Kali & Parrot | `aircrack-ng`, `wifite`, `kismet`, `reaver`, `bully`, `pixiewps` |
| **06. Reverse Engineering** | Kali & Parrot | `radare2`, `rizin`, `gdb`, `binwalk`, `ghidra`, `apktool` |
| **07. Exploitation & C2** | Kali & Parrot | `metasploit`, `responder`, `evil-winrm`, `netexec`, `ligolo-ng`, `sliver` |
| **08. Sniffing & Spoofing** | Kali & Parrot | `wireshark`, `tshark`, `tcpdump`, `bettercap`, `mitmproxy` |
| **09. Post-Exploitation** | Kali & Active Directory | `bloodhound`, `neo4j`, `mimikatz`, `impacket-scripts` |
| **10. Forensics & Recovery** | Kali & SleuthKit | `autopsy`, `sleuthkit`, `foremost`, `scalpel`, `testdisk` |
| **11. Anonymity & OpSec** | Parrot OS Anon | `anonsurf`, `tor`, `torsocks`, `proxychains4`, `macchanger`, `mat2` |
| **12. Frontier AI Red Teaming** | Zoth Sovereign AI | `hermes-agent`, `codex`, `claude`, `cline`, `ollama`, `garak`, `pyrit` |
| **13. Web3 & Smart Contracts** | Zoth Sovereign Web3 | `foundry` (forge/cast), `solana-cli`, `slither`, `mythril`, `ipfs` |

---

## 📦 Suites

- **`kali-top10`**: The 10 most indispensable offensive security tools.
- **`kali-core`**: The complete essential Kali Linux pentesting toolset.
- **`parrot-core`**: Core forensics, OSINT, and reversing tools from Parrot Security.
- **`parrot-anon`**: Parrot's system-wide anonymity stack (Anonsurf, Tor routing, MAC spoofing).
- **`zoth-ai`**: Frontier AI agents (`hermes`, `codex`, `claude`, `cline`, `ollama`, `garak`, `pyrit`).
- **`zoth-web3`**: Blockchain security, EVM auditing, and Solana developer toolchain.
- **`zoth-modern`**: Rust and Go high-speed rewrites (`rustscan`, `feroxbuster`, `ffuf`, `nuclei`, `ligolo-ng`).

---

## 🔒 Safe Apt Pinning

Zoth Arsenal configures `/etc/apt/preferences.d/zoth-arsenal.pref` so that base OS packages (`libc6`, `systemd`, `linux-image`) always prefer sovereign Debian Trixie (pin-priority 900), while security packages from Kali and Parrot are installed at pin-priority 100 without breaking your system.
