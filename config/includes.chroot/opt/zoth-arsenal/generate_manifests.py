#!/usr/bin/env python3
import json
import os

CATEGORIES = {
    "01-info-gathering": {
        "name": "Information Gathering & Recon",
        "description": "OSINT, network discovery, DNS enumeration, active & passive recon tools",
        "tools": [
            {"id": "nmap", "pkg": "nmap", "type": "apt", "desc": "Network exploration tool and security / port scanner", "suite": ["kali-top10", "parrot-core"]},
            {"id": "masscan", "pkg": "masscan", "type": "apt", "desc": "TCP port scanner, spews SYN packets asynchronously", "suite": ["kali-core", "parrot-core"]},
            {"id": "rustscan", "pkg": "rustscan", "type": "cargo_or_apt", "desc": "Modern Port Scanner written in Rust - scans 65k ports in 3s", "suite": ["zoth-modern"]},
            {"id": "theharvester", "pkg": "theharvester", "type": "apt", "desc": "E-mails, subdomains and names harvester - OSINT", "suite": ["kali-core", "parrot-core"]},
            {"id": "amass", "pkg": "amass", "type": "apt", "desc": "In-depth Attack Surface Mapping and Asset Discovery", "suite": ["kali-core", "parrot-core"]},
            {"id": "dnsrecon", "pkg": "dnsrecon", "type": "apt", "desc": "DNS Enumeration and Scanning script", "suite": ["kali-core", "parrot-core"]},
            {"id": "whois", "pkg": "whois", "type": "apt", "desc": "Intelligent WHOIS client", "suite": ["kali-core", "parrot-core"]},
            {"id": "whatweb", "pkg": "whatweb", "type": "apt", "desc": "Next generation web scanner identifies technologies", "suite": ["kali-core", "parrot-core"]},
            {"id": "wafw00f", "pkg": "wafw00f", "type": "apt", "desc": "Identify and fingerprint Web Application Firewalls (WAF)", "suite": ["kali-core"]},
            {"id": "recon-ng", "pkg": "recon-ng", "type": "apt", "desc": "Full-featured Web Reconnaissance framework written in Python", "suite": ["kali-core", "parrot-core"]},
            {"id": "sublist3r", "pkg": "sublist3r", "type": "apt", "desc": "Fast subdomains enumeration tool with search engine OSINT", "suite": ["kali-core", "parrot-core"]},
            {"id": "spiderfoot", "pkg": "spiderfoot", "type": "apt", "desc": "Automated OSINT collection engine", "suite": ["kali-core"]}
        ]
    },
    "02-vulnerability-analysis": {
        "name": "Vulnerability Analysis & Auditing",
        "description": "Network, host, and vulnerability scanners",
        "tools": [
            {"id": "nikto", "pkg": "nikto", "type": "apt", "desc": "Web server vulnerability scanner", "suite": ["kali-core", "parrot-core"]},
            {"id": "nuclei", "pkg": "nuclei", "type": "go_or_apt", "desc": "Fast and customizable vulnerability scanner based on simple YAML DSL", "suite": ["zoth-modern", "kali-core"]},
            {"id": "lynis", "pkg": "lynis", "type": "apt", "desc": "Security auditing tool for Unix/Linux based systems", "suite": ["parrot-core", "kali-core"]},
            {"id": "unix-privesc-check", "pkg": "unix-privesc-check", "type": "apt", "desc": "Automated privilege escalation auditing script", "suite": ["kali-core", "parrot-core"]},
            {"id": "yersinia", "pkg": "yersinia", "type": "apt", "desc": "Framework for analyzing and attacking routing and L2 protocols", "suite": ["kali-core"]},
            {"id": "cisco-auditing-tool", "pkg": "cisco-auditing-tool", "type": "apt", "desc": "PERL script for scanning Cisco routers for common vulnerabilities", "suite": ["kali-core"]}
        ]
    },
    "03-web-applications": {
        "name": "Web Application Security",
        "description": "Proxies, fuzzer suites, SQL injection, and web app audit tools",
        "tools": [
            {"id": "burpsuite", "pkg": "burpsuite", "type": "apt_or_appimage", "desc": "Interactive penetration testing of web applications", "suite": ["kali-top10", "parrot-core"]},
            {"id": "sqlmap", "pkg": "sqlmap", "type": "apt", "desc": "Automatic SQL injection and database takeover tool", "suite": ["kali-top10", "parrot-core"]},
            {"id": "commix", "pkg": "commix", "type": "apt", "desc": "Automated All-in-One OS Command Injection and Exploitation Tool", "suite": ["kali-core", "parrot-core"]},
            {"id": "ffuf", "pkg": "ffuf", "type": "apt", "desc": "Fast web fuzzer written in Go", "suite": ["kali-core", "parrot-core", "zoth-modern"]},
            {"id": "feroxbuster", "pkg": "feroxbuster", "type": "apt", "desc": "Fast, simple, recursive content discovery tool written in Rust", "suite": ["kali-core", "zoth-modern"]},
            {"id": "gobuster", "pkg": "gobuster", "type": "apt", "desc": "Directory/File, DNS and VHost busting tool written in Go", "suite": ["kali-core", "parrot-core"]},
            {"id": "wpscan", "pkg": "wpscan", "type": "apt", "desc": "Black box WordPress vulnerability scanner", "suite": ["kali-core", "parrot-core"]},
            {"id": "zaproxy", "pkg": "zaproxy", "type": "apt", "desc": "OWASP Zed Attack Proxy (ZAP)", "suite": ["kali-core", "parrot-core"]},
            {"id": "caido-cli", "pkg": "caido", "type": "binary", "desc": "Lightweight and fast web security auditing toolkit", "suite": ["zoth-modern"]}
        ]
    },
    "04-password-attacks": {
        "name": "Password & Authentication Attacks",
        "description": "Hash cracking, wordlist generators, brute-force engines",
        "tools": [
            {"id": "john", "pkg": "john", "type": "apt", "desc": "John the Ripper, a fast password cracker", "suite": ["kali-top10", "parrot-core"]},
            {"id": "hashcat", "pkg": "hashcat", "type": "apt", "desc": "World's fastest and most advanced password recovery utility", "suite": ["kali-top10", "parrot-core"]},
            {"id": "hydra", "pkg": "hydra", "type": "apt", "desc": "Very fast network logon cracker which supports many protocols", "suite": ["kali-top10", "parrot-core"]},
            {"id": "medusa", "pkg": "medusa", "type": "apt", "desc": "Speedy, parallel, and modular network authentication cracker", "suite": ["kali-core", "parrot-core"]},
            {"id": "crunch", "pkg": "crunch", "type": "apt", "desc": "Wordlist generator with custom charset definitions", "suite": ["kali-core", "parrot-core"]},
            {"id": "fcrackzip", "pkg": "fcrackzip", "type": "apt", "desc": "Fast password cracker for zip archives", "suite": ["kali-core", "parrot-core"]},
            {"id": "cewl", "pkg": "cewl", "type": "apt", "desc": "Custom word list generator from spidered web targets", "suite": ["kali-core", "parrot-core"]},
            {"id": "hashid", "pkg": "hashid", "type": "apt", "desc": "Identify the different types of hashes used to encrypt data", "suite": ["kali-core", "parrot-core"]},
            {"id": "wordlists", "pkg": "wordlists", "type": "apt", "desc": "SecLists, RockYou and comprehensive wordlists collection", "suite": ["kali-core", "parrot-core"]}
        ]
    },
    "05-wireless": {
        "name": "Wireless & RF Attacks",
        "description": "802.11 Wi-Fi, Bluetooth, SDR, and packet capture tools",
        "tools": [
            {"id": "aircrack-ng", "pkg": "aircrack-ng", "type": "apt", "desc": "Complete suite of tools to assess WiFi network security", "suite": ["kali-top10", "parrot-core"]},
            {"id": "wifite", "pkg": "wifite", "type": "apt", "desc": "Automated wireless attack tool for WEP, WPA/WPA2, and WPS", "suite": ["kali-core", "parrot-core"]},
            {"id": "kismet", "pkg": "kismet", "type": "apt", "desc": "Wireless network and device detector, sniffer, and WIDS", "suite": ["kali-core", "parrot-core"]},
            {"id": "reaver", "pkg": "reaver", "type": "apt", "desc": "Brute force attack tool against Wifi Protected Setup (WPS)", "suite": ["kali-core", "parrot-core"]},
            {"id": "bully", "pkg": "bully", "type": "apt", "desc": "Implementation of WPS brute force attack in C", "suite": ["kali-core", "parrot-core"]},
            {"id": "pixiewps", "pkg": "pixiewps", "type": "apt", "desc": "Offline brute-force WPS pin calculation tool", "suite": ["kali-core", "parrot-core"]},
            {"id": "hcxtools", "pkg": "hcxtools", "type": "apt", "desc": "Convert captured packets to hashcat format", "suite": ["kali-core", "parrot-core"]},
            {"id": "hcxdumptool", "pkg": "hcxdumptool", "type": "apt", "desc": "Small tool to capture packets from wlan devices", "suite": ["kali-core", "parrot-core"]}
        ]
    },
    "06-reverse-engineering": {
        "name": "Reverse Engineering & Binary Analysis",
        "description": "Disassemblers, decompilers, debuggers, and binary instrumentation",
        "tools": [
            {"id": "radare2", "pkg": "radare2", "type": "apt", "desc": "Advanced commandline hexadecimal editor, disassembler and debugger", "suite": ["kali-core", "parrot-core"]},
            {"id": "rizin", "pkg": "rizin", "type": "apt", "desc": "UNIX-like reverse engineering framework and command-line toolset", "suite": ["zoth-modern", "kali-core"]},
            {"id": "gdb", "pkg": "gdb", "type": "apt", "desc": "The GNU Debugger", "suite": ["kali-core", "parrot-core"]},
            {"id": "binwalk", "pkg": "binwalk", "type": "apt", "desc": "Firmware analysis tool to search binary images for embedded files", "suite": ["kali-core", "parrot-core"]},
            {"id": "apktool", "pkg": "apktool", "type": "apt", "desc": "Tool for reverse engineering 3rd party, closed, binary Android apps", "suite": ["kali-core", "parrot-core"]},
            {"id": "jadx", "pkg": "jadx", "type": "apt", "desc": "Dex to Java decompiler command line and GUI tools", "suite": ["kali-core", "parrot-core"]},
            {"id": "ghidra", "pkg": "ghidra", "type": "apt_or_appimage", "desc": "NSA software reverse engineering (SRE) suite", "suite": ["kali-core", "parrot-core"]}
        ]
    },
    "07-exploitation": {
        "name": "Exploitation & Payloads",
        "description": "Frameworks, payload generators, and remote command execution",
        "tools": [
            {"id": "metasploit-framework", "pkg": "metasploit-framework", "type": "apt", "desc": "World's most used penetration testing framework", "suite": ["kali-top10", "parrot-core"]},
            {"id": "exploitdb", "pkg": "exploitdb", "type": "apt", "desc": "The Exploit Database archive and searchsploit utility", "suite": ["kali-core", "parrot-core"]},
            {"id": "responder", "pkg": "responder", "type": "apt", "desc": "LLMNR, NBT-NS and MDNS poisoner, with built-in HTTP/SMB auth server", "suite": ["kali-top10", "parrot-core"]},
            {"id": "impacket-scripts", "pkg": "impacket-scripts", "type": "apt", "desc": "Collection of Python classes and tools for working with network protocols", "suite": ["kali-core", "parrot-core"]},
            {"id": "evil-winrm", "pkg": "evil-winrm", "type": "apt", "desc": "Ultimate WinRM shell for hacking/pentesting Windows machines", "suite": ["kali-core", "parrot-core"]},
            {"id": "netexec", "pkg": "netexec", "type": "pip_or_apt", "desc": "The network execution tool that makes AD pentesting fun again (CrackMapExec successor)", "suite": ["kali-core", "parrot-core", "zoth-modern"]},
            {"id": "sliver", "pkg": "sliver", "type": "binary", "desc": "Adversary emulation / red team C2 framework", "suite": ["zoth-modern"]},
            {"id": "ligolo-ng", "pkg": "ligolo-ng", "type": "binary", "desc": "Advanced tunneling / pivoting tool using TUN interfaces", "suite": ["zoth-modern"]},
            {"id": "chisel", "pkg": "chisel", "type": "binary_or_apt", "desc": "Fast TCP/UDP tunnel over HTTP secured via SSH", "suite": ["zoth-modern", "kali-core"]}
        ]
    },
    "08-sniffing-spoofing": {
        "name": "Sniffing & Spoofing",
        "description": "Network traffic interception, packet capture, MITM attacks",
        "tools": [
            {"id": "wireshark", "pkg": "wireshark", "type": "apt", "desc": "Network protocol analyzer and interactive packet capture", "suite": ["kali-top10", "parrot-core"]},
            {"id": "tshark", "pkg": "tshark", "type": "apt", "desc": "Terminal-based Wireshark packet capture engine", "suite": ["kali-core", "parrot-core"]},
            {"id": "tcpdump", "pkg": "tcpdump", "type": "apt", "desc": "Powerful command-line packet analyzer", "suite": ["kali-core", "parrot-core"]},
            {"id": "bettercap", "pkg": "bettercap", "type": "apt", "desc": "The Swiss Army knife for 802.11, BLE, IPv4/IPv6 networks and MITM", "suite": ["kali-core", "parrot-core"]},
            {"id": "ettercap-text-only", "pkg": "ettercap-text-only", "type": "apt", "desc": "Multipurpose sniffer/interceptor/logger for switched LAN", "suite": ["kali-core", "parrot-core"]},
            {"id": "dsniff", "pkg": "dsniff", "type": "apt", "desc": "Various tools to sniff network traffic for cleartext passwords", "suite": ["kali-core", "parrot-core"]},
            {"id": "mitmproxy", "pkg": "mitmproxy", "type": "apt", "desc": "Interactive TLS-capable intercepting HTTP proxy for console", "suite": ["kali-core", "parrot-core"]}
        ]
    },
    "09-post-exploitation": {
        "name": "Post-Exploitation & Lateral Movement",
        "description": "Privilege escalation, persistence, and Active Directory analysis",
        "tools": [
            {"id": "bloodhound", "pkg": "bloodhound", "type": "apt", "desc": "Six Degrees of Domain Admin - AD relationship graph analyzer", "suite": ["kali-core", "parrot-core"]},
            {"id": "neo4j", "pkg": "neo4j", "type": "apt", "desc": "Graph database required for BloodHound backend", "suite": ["kali-core", "parrot-core"]},
            {"id": "mimikatz", "pkg": "mimikatz", "type": "apt", "desc": "Windows credential extraction tool for security research", "suite": ["kali-core"]},
            {"id": "powersploit", "pkg": "powersploit", "type": "apt", "desc": "PowerShell post-exploitation framework", "suite": ["kali-core"]}
        ]
    },
    "10-forensics": {
        "name": "Forensics & Anti-Forensics",
        "description": "Disk analysis, memory extraction, timeline generation",
        "tools": [
            {"id": "autopsy", "pkg": "autopsy", "type": "apt", "desc": "Graphical interface to The Sleuth Kit digital forensics tools", "suite": ["kali-core", "parrot-core"]},
            {"id": "sleuthkit", "pkg": "sleuthkit", "type": "apt", "desc": "Collection of command line tools for file system forensics", "suite": ["kali-core", "parrot-core"]},
            {"id": "foremost", "pkg": "foremost", "type": "apt", "desc": "File carving tool to recover files based on headers/footers", "suite": ["kali-core", "parrot-core"]},
            {"id": "scalpel", "pkg": "scalpel", "type": "apt", "desc": "Frugal, high performance file carver", "suite": ["kali-core", "parrot-core"]},
            {"id": "testdisk", "pkg": "testdisk", "type": "apt", "desc": "Partition scanner and disk recovery tool", "suite": ["kali-core", "parrot-core"]},
            {"id": "volatility3", "pkg": "volatility3", "type": "pip_or_apt", "desc": "Advanced memory forensics framework", "suite": ["kali-core", "parrot-core"]}
        ]
    },
    "11-anonymity-opsec": {
        "name": "Anonymity & Operational Security (Parrot & Zoth OpSec)",
        "description": "Tor, VPNs, MAC spoofing, secure deletion, and metadata scrubbing",
        "tools": [
            {"id": "anonsurf", "pkg": "anonsurf", "type": "script", "desc": "Parrot OS system-wide anonymous Tor routing with DNS tunneling", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "tor", "pkg": "tor", "type": "apt", "desc": "Anonymizing overlay network for TCP", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "torsocks", "pkg": "torsocks", "type": "apt", "desc": "Use SOCKS-friendly applications with Tor transparently", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "proxychains4", "pkg": "proxychains4", "type": "apt", "desc": "Redirect connections through SOCKS4, SOCKS5 or HTTP proxies", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "macchanger", "pkg": "macchanger", "type": "apt", "desc": "Utility for viewing and manipulating MAC addresses of interfaces", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "bleachbit", "pkg": "bleachbit", "type": "apt", "desc": "Delete unnecessary files and shred confidential data", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "mat2", "pkg": "mat2", "type": "apt", "desc": "Metadata removal tool supporting many file types", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "firejail", "pkg": "firejail", "type": "apt", "desc": "Linux namespaces and seccomp-bpf sandbox program", "suite": ["parrot-anon", "zoth-opsec"]},
            {"id": "steghide", "pkg": "steghide", "type": "apt", "desc": "Steganography program that hides data in image and audio files", "suite": ["parrot-anon", "zoth-opsec"]}
        ]
    },
    "12-ai-red-teaming": {
        "name": "Frontier AI Red Teaming & Agent Stack",
        "description": "Autonomous agents, local inference, model red teaming & prompt injection testbeds",
        "tools": [
            {"id": "hermes-agent", "pkg": "hermes-agent", "type": "binary", "desc": "Nous Research autonomous agent runtime & model reasoning engine", "suite": ["zoth-ai"]},
            {"id": "openai-codex", "pkg": "codex", "type": "binary", "desc": "Open-source autonomous CLI developer agent", "suite": ["zoth-ai"]},
            {"id": "claude-code", "pkg": "claude", "type": "npm", "desc": "Anthropic Claude Code command-line developer workflow", "suite": ["zoth-ai"]},
            {"id": "cline", "pkg": "cline", "type": "binary", "desc": "Autonomous coding agent CLI with tool execution and multi-provider models", "suite": ["zoth-ai"]},
            {"id": "ollama", "pkg": "ollama", "type": "binary", "desc": "Get up and running with Llama 3, Mistral, Gemma locally", "suite": ["zoth-ai"]},
            {"id": "aider", "pkg": "aider-chat", "type": "pip", "desc": "AI pair programming in your terminal", "suite": ["zoth-ai"]},
            {"id": "garak", "pkg": "garak", "type": "pip", "desc": "LLM vulnerability scanner (hallucination, jailbreak, prompt injection)", "suite": ["zoth-ai"]},
            {"id": "pyrit", "pkg": "pyrit", "type": "pip", "desc": "Python Risk Identification Tool for Generative AI (AI Red Teaming)", "suite": ["zoth-ai"]},
            {"id": "litellm", "pkg": "litellm", "type": "pip", "desc": "Call 100+ LLMs using OpenAI format with proxy load balancing", "suite": ["zoth-ai"]},
            {"id": "fastmcp", "pkg": "fastmcp", "type": "pip", "desc": "Anthropic Model Context Protocol server framework", "suite": ["zoth-ai"]}
        ]
    },
    "13-web3-blockchain": {
        "name": "Web3 & Smart Contract Security",
        "description": "EVM, Solana, smart contract fuzzing, auditing, and ledger tools",
        "tools": [
            {"id": "solana-cli", "pkg": "solana", "type": "binary", "desc": "Solana Blockchain CLI and cluster administration tools", "suite": ["zoth-web3"]},
            {"id": "foundry", "pkg": "foundry", "type": "binary", "desc": "Blazing fast, portable and modular toolkit for Ethereum (forge, cast, anvil)", "suite": ["zoth-web3"]},
            {"id": "slither", "pkg": "slither-analyzer", "type": "pip", "desc": "Static analysis framework for Solidity smart contracts", "suite": ["zoth-web3"]},
            {"id": "mythril", "pkg": "mythril", "type": "pip", "desc": "Security analysis tool for EVM bytecode using concolic analysis", "suite": ["zoth-web3"]},
            {"id": "ipfs", "pkg": "ipfs", "type": "binary", "desc": "Global, versioned, peer-to-peer decentralized filesystem", "suite": ["zoth-web3"]}
        ]
    }
}

SUITES = {
    "kali-top10": ["nmap", "wireshark", "aircrack-ng", "john", "hydra", "burpsuite", "sqlmap", "responder", "metasploit-framework", "hashcat"],
    "kali-core": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "kali-core" in t["suite"] or "kali-top10" in t["suite"]],
    "parrot-core": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "parrot-core" in t["suite"]],
    "parrot-anon": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "parrot-anon" in t["suite"]],
    "zoth-ai": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "zoth-ai" in t["suite"]],
    "zoth-web3": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "zoth-web3" in t["suite"]],
    "zoth-opsec": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "zoth-opsec" in t["suite"]],
    "zoth-modern": [t["id"] for cat in CATEGORIES.values() for t in cat["tools"] if "zoth-modern" in t["suite"]],
}

os.makedirs("manifests", exist_ok=True)
os.makedirs("suites", exist_ok=True)

# Write per-category JSON
for cat_id, cat_data in CATEGORIES.items():
    with open(f"manifests/{cat_id}.json", "w") as f:
        json.dump(cat_data, f, indent=2)

# Write consolidated index
all_tools = {}
for cat_id, cat_data in CATEGORIES.items():
    for tool in cat_data["tools"]:
        tool["category"] = cat_id
        tool["category_name"] = cat_data["name"]
        all_tools[tool["id"]] = tool

index_data = {
    "version": "1.0.0",
    "updated": "2026-09-23",
    "categories": {cat_id: {"name": d["name"], "description": d["description"], "count": len(d["tools"])} for cat_id, d in CATEGORIES.items()},
    "suites": {s_name: len(s_tools) for s_name, s_tools in SUITES.items()},
    "tools": all_tools
}

with open("manifests/index.json", "w") as f:
    json.dump(index_data, f, indent=2)

# Write suites text files
for suite_name, tool_ids in SUITES.items():
    with open(f"suites/{suite_name}.txt", "w") as f:
        f.write(f"# ZOTH ARSENAL SUITE: {suite_name}\n")
        for tid in sorted(set(tool_ids)):
            f.write(f"{tid}\n")

print(f"Generated {len(CATEGORIES)} categories, {len(all_tools)} tools, {len(SUITES)} suites.")
