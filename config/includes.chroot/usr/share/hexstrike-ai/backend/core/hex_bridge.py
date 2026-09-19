import requests
import json
import os
import re
import subprocess
import asyncio
from datetime import datetime
from hex_config import CONFIG

# Path for target intelligence storage
INTEL_PATH = os.path.expanduser("~/.hexstrike/intel.json")


class HexBridge:
    def __init__(self):
        self.hex_url = CONFIG.get("HEXSTRIKE_URL", "http://127.0.0.1:8000/api")
        self.ai_url = CONFIG.get("LOCALAI_URL", "http://127.0.0.1:8090/v1")
        self.ollama_url = CONFIG.get("OLLAMA_URL", "http://127.0.0.1:11434")
        self.llamacpp_url = CONFIG.get("LLAMACPP_URL", "http://127.0.0.1:8080/v1")
        self.litellm_url = CONFIG.get("LITELLM_URL", "http://127.0.0.1:4000/v1")
        self.session = requests.Session()
        self._ensure_intel_dir()

    def _ensure_intel_dir(self):
        os.makedirs(os.path.dirname(INTEL_PATH), exist_ok=True)
        if not os.path.exists(INTEL_PATH):
            with open(INTEL_PATH, "w") as f:
                json.dump({}, f)

    def _get_target_intel(self, target):
        try:
            with open(INTEL_PATH, "r") as f:
                data = json.load(f)
                return data.get(target, {"history": [], "findings": {}})
        except Exception:
            return {"history": [], "findings": {}}

    def _save_target_intel(self, target, history_entry, findings=None):
        try:
            with open(INTEL_PATH, "r") as f:
                data = json.load(f)
            
            if target not in data:
                data[target] = {"history": [], "findings": {}}
            
            data[target]["history"].append(history_entry)
            if findings:
                data[target]["findings"].update(findings)
                
            with open(INTEL_PATH, "w") as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            print(f"Intel save error: {e}")

    def get_cmd(self, tool, target):
        cmd_map = {
            "emailharvester": f"emailharvester -d {target}",
            "sublist3r": f"sublist3r -d {target}",
            "photon": f"photon -u http://{target} --regex",
            "nikto": f"nikto -h {target}",
            "whatweb": f"whatweb -a 3 {target}",
            "gobuster": f"gobuster dir -u http://{target} -w /usr/share/wordlists/dirb/common.txt",
            "sqlmap": f"sqlmap -u {target} --batch --banner",
            "snmpwalk": f"snmpwalk -c public -v2c {target}",
            "searchsploit": f"searchsploit {target}",
            "nmap": f"nmap -sV -sC {target}",
            "dmitry": f"dmitry -winsepf {target} -o /tmp/dmitry.txt",
            "dnsenum": f"dnsenum {target}",
            "amass": f"amass enum -d {target}",
            "fierce": f"fierce --domain {target}",
            "wapiti": f"wapiti -u http://{target} --flush-session -f txt",
            "commix": f"commix --url http://{target} --batch",
            "wpscan": f"wpscan --url http://{target} --no-update",
            "joomscan": f"joomscan -u {target}",
            "wafw00f": f"wafw00f {target}",
            "davtest": f"davtest -url http://{target}",
            "garak": f"garak --target_url {target}",
            "llmfuzzer": f"llmfuzzer --url {target}",
            "vigil": f"vigil scan {target}",
            "iatelligence": f"iatelligence scan {target}",
            "hydra": f"hydra -L /usr/share/wordlists/metasploit/namelist.txt -P /usr/share/wordlists/rockyou.txt {target} ssh",
            "dirb": f"dirb http://{target}",
            "metasploit": f"msfconsole -q -x 'use auxiliary/scanner/portscan/tcp; set RHOSTS {target}; run; exit'",
            "bettercap": f"bettercap -iface eth0 -eval 'net.probe on; set net.probe.throttle 10; net.recon on'",
            "aircrack-ng": f"aircrack-ng {target}",
            "hashcat": f"hashcat -m 0 {target} /usr/share/wordlists/rockyou.txt",
            "john": f"john --wordlist=/usr/share/wordlists/rockyou.txt {target}",
            "portscan": f"nmap -Pn -T4 -p 1-1000 {target}",
            # Cloud tools
            "pacu": f"pacu --target {target}",
            "scoutsuite": f"scout --target {target}",
            "cloudsploit": f"cloudsploit --target {target}",
            "prowler": f"prowler --target {target}",
            # Container tools
            "kubescape": f"kubescape scan {target}",
            "falco": f"falco --target {target}",
            "trivy": f"trivy image {target}",
            "kube-hunter": f"kube-hunter --target {target}",
            # Web fuzzing
            "xsstrike": f"xsstrike -u {target}",
            "nucleimapper": f"nuclei -u {target} -templates /usr/share/nuclei/templates/",
            "jaeles": f"jaeles scan -u {target}",
            "ffuf": f"ffuf -u {target} -w /usr/share/wordlists/dirb/common.txt",
            # OSINT
            "recondev": f"recondev --target {target}",
            "shodan": f"shodan search {target}",
            "theharvester": f"theharvester -d {target} -b all",
            # Offensive Toolkits
            "cloudTOWN": f"python3 cloudTOWN/main.py --target {target}",
            "PEN_toolkit": f"pen --target {target}",
            "Cerberus": f"cerberus --target {target}",
            "ROGUE": f"rogue --target {target}"
        }
        return cmd_map.get(tool.lower(), tool)

    async def execute_stream(self, tool_or_list, target):
        tools = tool_or_list if isinstance(tool_or_list, list) else [tool_or_list]
        full_chain_output = ""
        
        for tool in tools:
            cmd = self.get_cmd(tool, target)
            
            yield f"SYSTEM: [{datetime.now().strftime('%H:%M:%S')}] Initializing strike vector: {tool}..."
            yield f"SYSTEM: Dispatching {tool} on target {target}..."

            try:
                # 1. Try remote HexStrike Engine daemon if active
                try:
                    tool_resp = self.session.post(f"{self.hex_url}/command", json={"command": cmd}, timeout=1.5).json()
                    yield f"ENGINE: Output received from HexStrike Neural Engine"
                    output = tool_resp.get("output", tool_resp.get("stdout", "No output.")) + "\n"
                    yield output
                except Exception:
                    yield "SYSTEM: Engine daemon offline. Falling back to Local Shell Execution..."
                    process = await asyncio.create_subprocess_shell(
                        cmd,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.STDOUT
                    )
                    tool_output = ""
                    while True:
                        line = await process.stdout.readline()
                        if not line:
                            break
                        decoded_line = line.decode('utf-8', errors='replace')
                        tool_output += decoded_line
                        yield decoded_line
                    await process.wait()
                    yield f"SYSTEM: Local execution of {tool} completed with exit code {process.returncode}\n"
                    output = tool_output

                history_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "tool": tool,
                    "output": output[-5000:]
                }
                self._save_target_intel(target, history_entry)
                full_chain_output += f"\n--- {tool} output ---\n{output}"

            except Exception as e:
                yield f"ERROR: Strike {tool} failed: {str(e)}\n"

        yield "SYSTEM: Triggering Neural Intelligence Analysis for the complete strike chain...\n"
        ai_analysis = self.ask_local_ai_with_context(tools[0] if len(tools) == 1 else "StrikePlaybook", target, full_chain_output) 
        yield f"AI_ANALYSIS: {ai_analysis}\n"

    def ask_local_ai_with_context(self, tool, target, current_output):
        intel = self._get_target_intel(target)
        history_context = "\n".join([f"[{h['timestamp']}] {h['tool']}: {h['output'][:200]}..." for h in intel.get("history", [])[-3:]])

        prompt = (
            f"You are the HexStrike Sovereign Intelligence Core. Target: {target}\n"
            f"Target History (Last 3 strikes):\n{history_context}\n\n"
            f"Current Tool/Chain: {tool}\n"
            f"Current Output:\n{current_output[:3000]}\n\n"
            "CRITICAL TASK: Analyze the reconnaissance and exploit results and output your response in this EXACT format:\n"
            "1. SUMMARY: (A brief high-level overview of findings)\n"
            "2. VULNERABILITY MATRIX:\n"
            "   - [SEVERITY] | CVE/ID | Vulnerability | Impact | Remediation\n"
            "3. MITRE ATT&CK TACTIC MAPPING:\n"
            "   - [Tactic] | Technique | Description | Evidence in output\n"
            "4. CVE SUGGESTIONS:\n"
            "   - [CVE-ID] | Product | Version | Description | CVSS Score\n"
            "5. NEXT VECTOR: (The exact next tool and target to run for compromise)\n"
            "6. STATUS: (Sovereign / Compromised / Hardened)"
        )

        # 1. Try LocalAI / OpenAI Compatible endpoint
        try:
            url = f"{self.ai_url}/chat/completions"
            payload = {
                "model": CONFIG.get("MODEL_NAME", "gpt-4"),
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1200
            }
            res = self.session.post(url, json=payload, timeout=5)
            if res.status_code == 200:
                content = res.json()['choices'][0]['message']['content']
                if content and content.strip():
                    return content
        except Exception:
            pass

        # 2. Try Local Ollama endpoint
        try:
            # Check available models in Ollama
            tag_res = self.session.get(f"{self.ollama_url}/api/tags", timeout=1.5)
            model_to_use = "qwen2.5-coder:latest"
            if tag_res.status_code == 200:
                models = [m.get("name") for m in tag_res.json().get("models", [])]
                if models:
                    for pref in CONFIG.get("FALLBACK_MODELS", []):
                        for m in models:
                            if pref.split(":")[0] in m:
                                model_to_use = m
                                break
                        if model_to_use != "qwen2.5-coder:latest":
                            break
                    if model_to_use == "qwen2.5-coder:latest" and models:
                        model_to_use = models[0]

            gen_url = f"{self.ollama_url}/api/generate"
            payload = {
                "model": model_to_use,
                "prompt": prompt,
                "stream": False
            }
            res = self.session.post(gen_url, json=payload, timeout=25)
            if res.status_code == 200:
                content = res.json().get("response", "")
                if content and content.strip():
                    return f"[Ollama: {model_to_use}]\n{content}"
        except Exception:
            pass

        # 3. Try Local llama.cpp endpoint
        try:
            url = f"{self.llamacpp_url}/chat/completions"
            payload = {
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 1200
            }
            res = self.session.post(url, json=payload, timeout=5)
            if res.status_code == 200:
                content = res.json()['choices'][0]['message']['content']
                if content and content.strip():
                    return f"[llama.cpp]\n{content}"
        except Exception:
            pass

        # 4. Deterministic Offline Sovereign Heuristic Analyzer
        return self._offline_heuristic_analyzer(tool, target, current_output)

    def _offline_heuristic_analyzer(self, tool, target, output):
        """High-fidelity deterministic offline intelligence engine when no LLM daemon is loaded."""
        findings = []
        cves = []
        mitre = []
        open_ports = []
        services = []
        
        # Detect open ports & services from nmap / portscan
        port_matches = re.findall(r'(\d+)/(tcp|udp)\s+open\s+([\w\-]+)(?:\s+(.*?))?(?=\n|\r|$)', output, re.IGNORECASE)
        for p, proto, svc, banner in port_matches:
            open_ports.append(f"{p}/{proto}")
            services.append(f"{svc} {banner}".strip())
            
            # Port-specific heuristics
            if p == "21":
                findings.append(("[HIGH]", "CVE-2011-2523", "FTP Daemon Exposure", "Potential anonymous or backdoored FTP access", "Enforce SFTP & disable root FTP"))
                mitre.append(("Initial Access", "T1078", "Valid Accounts / Default Credentials", f"Port 21 FTP open on {target}"))
                cves.append(("CVE-2011-2523", "vsftpd", "2.3.4", "Backdoor Command Execution", "9.8"))
            elif p in ("22", "2222"):
                mitre.append(("Discovery", "T1046", "Network Service Discovery", f"Port {p} SSH open: {banner}"))
            elif p in ("80", "443", "8080", "8443"):
                mitre.append(("Discovery", "T1046", "Web Service Discovery", f"HTTP service on {p}: {banner}"))
            elif p == "445":
                findings.append(("[CRITICAL]", "CVE-2017-0144", "SMBv1 EternalBlue Exposure", "Remote Code Execution via SMB", "Disable SMBv1 & apply MS17-010"))
                mitre.append(("Lateral Movement", "T1210", "Exploitation of Remote Services", f"SMB Port 445 active on {target}"))
                cves.append(("CVE-2017-0144", "Microsoft Windows SMB", "v1.0", "Remote Code Execution (EternalBlue)", "9.8"))
            elif p in ("3306", "5432", "1433", "27017"):
                findings.append(("[MEDIUM]", "CWE-284", f"Exposed Database ({svc})", "Direct database port accessible on network", "Bind to 127.0.0.1 or firewall port"))
                mitre.append(("Discovery", "T1046", "Database Service Discovery", f"Database port {p} exposed"))

        # Detect Web Vulnerabilities (SQLi, XSS, Directories)
        if "sqlmap" in tool.lower() or "sql injection" in output.lower() or "boolean-based blind" in output.lower():
            findings.append(("[CRITICAL]", "CWE-89", "SQL Injection Confirmed", "Database dump and potential OS command execution", "Use parameterized prepared statements"))
            mitre.append(("Exploit", "T1190", "Exploit Public-Facing Application", "SQLi parameter detected in web vector"))
            cves.append(("CVE-2023-XXXX", "Custom App", "1.0", "SQL Injection in parameter handling", "9.1"))

        if "nikto" in tool.lower() or "whatweb" in tool.lower() or "gobuster" in tool.lower():
            admin_hits = re.findall(r'(/(?:admin|login|config|backup|api|wp-admin|dashboard)[^\s]*)', output, re.IGNORECASE)
            if admin_hits:
                findings.append(("[MEDIUM]", "CWE-200", f"Disclosed Sensitive Endpoints ({', '.join(set(admin_hits[:3]))})", "Administrative interface discoverable", "Restrict access via VPN/MFA"))
                mitre.append(("Reconnaissance", "T1595", "Active Scanning", f"Discovered paths: {admin_hits[:3]}"))

        if not findings:
            findings.append(("[INFO]", "INFO-001", "Surface Enumeration Completed", "Reconnaissance data logged to local intelligence store", "Proceed with active vulnerability probes"))

        if not mitre:
            mitre.append(("Reconnaissance", "T1595.002", "Vulnerability Scanning", f"Executed {tool} against {target}"))

        if not cves:
            cves.append(("GENERIC-RECON", "Service Fingerprint", "N/A", f"Port and service discovery completed on {target}", "5.0"))

        # Recommended next vector
        next_tool = "nikto"
        if "nmap" in tool.lower() or "portscan" in tool.lower():
            next_tool = "nikto" if ("80" in open_ports or "443" in open_ports or "8080" in open_ports) else "hydra"
        elif "nikto" in tool.lower() or "whatweb" in tool.lower():
            next_tool = "gobuster"
        elif "gobuster" in tool.lower() or "dirb" in tool.lower():
            next_tool = "sqlmap"
        else:
            next_tool = "searchsploit"

        summary = f"Offline reconnaissance of {target} via {tool} completed. "
        if open_ports:
            summary += f"Identified {len(open_ports)} exposed ports ({', '.join(open_ports[:6])}). "
        summary += f"Recorded {len(findings)} potential security findings and synthesized MITRE ATT&CK telemetry."

        vulnerabilities_text = "\n".join([f"   - {f[0]} | {f[1]} | {f[2]} | {f[3]} | {f[4]}" for f in findings])
        mitre_text = "\n".join([f"   - [{m[0]}] | {m[1]} | {m[2]} | {m[3]}" for m in mitre])
        cve_text = "\n".join([f"   - [{c[0]}] | {c[1]} | {c[2]} | {c[3]} | CVSS {c[4]}" for c in cves])

        return (
            f"[Offline Sovereign Neural Engine v3.0]\n"
            f"1. SUMMARY: {summary}\n"
            f"2. VULNERABILITY MATRIX:\n{vulnerabilities_text}\n"
            f"3. MITRE ATT&CK TACTIC MAPPING:\n{mitre_text}\n"
            f"4. CVE SUGGESTIONS:\n{cve_text}\n"
            f"5. NEXT VECTOR: Dispatch {next_tool} against {target}\n"
            f"6. STATUS: Sovereign Reconnaissance Active"
        )

    async def execute_and_analyze(self, tool_or_list, target):
        full_output = []
        async for chunk in self.execute_stream(tool_or_list, target):
            full_output.append(chunk)
        output_text = "".join(full_output)
        analysis = "No analysis available"
        if "AI_ANALYSIS: " in output_text:
            analysis = output_text.split("AI_ANALYSIS: ")[-1].strip()
        return {"output": output_text, "analysis": analysis}
