// Defensive Offline Simulation Engine
// Provides high-fidelity realistic outputs & neural reasoning when backend is disconnected.

export const toolSimulators = {
  nmap: (target) => {
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
    const host = isIp ? target : `${target} (${target}.in-addr.arpa)`;
    return {
      output: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().split('T')[0]} 08:30 UTC
Nmap scan report for ${host}
Host is up (0.0034s latency).
Not shown: 994 closed tcp ports (reset)
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http        nginx/1.24.0 (Ubuntu)
|_http-server-header: nginx/1.24.0
|_http-title: Did not follow redirect to https://${target}/
443/tcp  open  ssl/https   nginx/1.24.0 (Ubuntu)
|_ssl-date: TLS.1.3 SHA256 (RSA 4096 bits)
|_http-security-headers: Strict-Transport-Security: max-age=31536000
8080/tcp open  http-proxy  Traefik 2.10.4 API Gateway
9000/tcp open  cslistener  FastAPI Uvicorn Orchestrator (Python 3.11)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel:5.15.0

NSE: Script Post-scanning.
Initiating NSE at 08:30:12
Completed NSE at 08:30:14, 2.01s elapsed
Nmap done: 1 IP address (1 host up) scanned in 4.18 seconds`,
      analysis: `[AI REASONING CORE v4.1 - THREAT ASSESSMENT]
Target Surface Analysis for '${target}':
1. Open Edge Ports: [22, 80, 443, 8080, 9000]
2. Attack Vectors Detected:
   - Port 9000 exposes internal FastAPI/Uvicorn orchestrator endpoints without mTLS.
   - Port 8080 (Traefik Gateway) should be audited for unprotected dashboard exposure /api/rawdata.
   - OpenSSH 8.9p1 requires hardening against automated brute-force attacks (Fail2ban / Key-only).
3. Recommended Strike Sequence:
   - Dispatch 'whatweb' or 'gobuster' against Port 8080 and 9000.
   - Test for parameter injections via 'commix' on exposed API routes.`
    };
  },

  nikto: (target) => {
    return {
      output: `- Nikto v2.5.0
+ Target IP:          ${target}
+ Target Hostname:    ${target}
+ Target Port:        443 (HTTPS)
+ Start Time:         ${new Date().toISOString()}
---------------------------------------------------------------------------
+ Server: nginx/1.24.0
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-Content-Type-Options header is not set.
+ Root page / redirects to /login.
+ Cookie session_id created without the httponly flag.
+ /api/v1/debug: Debugging endpoint found returning 200 OK (Exposes runtime env).
+ /swagger.json: OpenAPI Specification file discovered.
+ /admin/config.bak: Backup configuration file discovered (Possible credential leak).
+ 7842 requests: 0 error(s) and 6 item(s) reported on remote host
---------------------------------------------------------------------------
+ End Time:           ${new Date().toISOString()} (14 seconds)`,
      analysis: `[AI NEURAL VULNERABILITY AUDIT]
High-Severity Findings Identified:
1. SENSITIVE FILE LEAK: '/admin/config.bak' - High probability of database credentials or JWT signing secrets.
2. DEBUG EXPOSURE: '/api/v1/debug' allows external introspection of environment variables.
3. WEAK SESSION SECURITY: Session cookies lack 'HttpOnly' and 'SameSite=Strict' flags.
Next Action: Run 'trufflehog' or 'searchsploit' against the discovered backend components.`
    };
  },

  sqlmap: (target) => {
    return {
      output: `        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.7.11#stable}
|_ -| . [.]     | .'| . |
|___|_  ["]_|_|_|__,|  _|
      |_|           |_|   http://sqlmap.org

[*] starting @ ${new Date().toLocaleTimeString()}

[08:31:02] [INFO] testing connection to the target URL
[08:31:04] [INFO] testing if the target URL content is stable
[08:31:05] [INFO] target URL content is stable
[08:31:06] [INFO] testing if GET parameter 'id' is dynamic
[08:31:07] [INFO] confirming that GET parameter 'id' is dynamic
[08:31:09] [INFO] heuristics detected that GET parameter 'id' might be injectable (possible DBMS: 'PostgreSQL')
[08:31:11] [INFO] testing for SQL injection on GET parameter 'id'
heuristic (basic) test shows that GET parameter 'id' might be injectable
[08:31:13] [INFO] GET parameter 'id' is vulnerable. Do you want to keep testing the others (if any)? [y/N] N
sqlmap identified the following injection point(s) with a total of 48 HTTP(s) requests:
---
Parameter: id (GET)
    Type: boolean-based blind
    Title: AND boolean-based blind - WHERE or HAVING clause
    Payload: id=104 AND 4812=4812

    Type: time-based blind
    Title: PostgreSQL > 8.1 AND time-based blind (query SLEEP)
    Payload: id=104 AND 8291=(SELECT 8291 FROM PG_SLEEP(5))
---
[08:31:16] [INFO] the back-end DBMS is PostgreSQL
web application technology: Nginx, Python
back-end DBMS: PostgreSQL >= 14.0`,
      analysis: `[AI EXPLOIT INTELLIGENCE MATRIX]
Critical Finding: Target parameter 'id' is confirmed vulnerable to Blind SQL Injection (PostgreSQL >= 14.0).
Exploitability: HIGH (CVSS 8.8)
Impact:
- Database extraction possible via Boolean and Time-based Blind techniques.
- Schema enumeration & credential hashes retrieval achievable.
Mitigation:
- Enforce parameterized prepared statements (e.g. asyncpg/SQLAlchemy ORM bindings).
- Implement input validation with strict regex integer casting.`
    };
  },

  amass: (target) => {
    return {
      output: `[OWASP Amass v4.2.0 - Active Asset Discovery]
Domain: ${target}
-------------------------------------------------------------------------------
api.${target}                    (FQDN) --> 104.21.48.12 (Cloudflare)
auth.${target}                   (FQDN) --> 104.21.48.13 (Cloudflare)
stage-dev.${target}              (FQDN) --> 198.51.100.44 (Direct Origin - Unfiltered!)
admin-vault.${target}            (FQDN) --> 198.51.100.45 (AWS US-East-1)
cdn.${target}                    (FQDN) --> 151.101.65.140 (Fastly)
internal-metrics.${target}       (FQDN) --> 10.0.4.15 (Private LAN Leak)
mail.${target}                   (FQDN) --> 198.51.100.48 (Postfix/Dovecot)
-------------------------------------------------------------------------------
Discovered 7 subdomains across 4 Autonomous Systems (AS13335, AS16509, AS54113).`,
      analysis: `[AI ATTACK SURFACE INTEL]
Critical Origin Exposure:
- 'stage-dev.${target}' bypasses Cloudflare CDN and resolves directly to origin IP '198.51.100.44'.
- 'internal-metrics.${target}' leaks private network topology (10.0.4.0/24 subnet).
Recommendation:
- Probe 'stage-dev.${target}' for unrestricted CORS headers, exposed GraphQL introspection, and default credentials.`
    };
  },

  gobuster: (target) => {
    return {
      output: `===============================================================
Gobuster v3.6 - Directory & File Buster
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://${target}
[+] Method:                  GET
[+] Threads:                 16
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Status codes:            200,204,301,302,307,401,403
===============================================================
Starting gobuster in directory enumeration mode
===============================================================
/.git/HEAD            (Status: 200) [Size: 41]
/.env                 (Status: 200) [Size: 842]  <-- CRITICAL
/admin                (Status: 301) [Size: 178] [--> /admin/]
/api                  (Status: 200) [Size: 154]
/backup               (Status: 403) [Size: 284]
/docs                 (Status: 200) [Size: 3120]
/healthz              (Status: 200) [Size: 18]
/swagger              (Status: 200) [Size: 4210]
===============================================================
Finished: 4,614 requests in 2.89s (1,596 req/s)`,
      analysis: `[AI EXPLOITATION VECTOR]
CRITICAL SEVERITY FINDING:
- '/.git/HEAD' and '/.env' are publicly downloadable with HTTP 200 status!
- Immediate Risk: Complete repository source reconstruction and plaintext API secret extraction.
Automated Payload Suggestion:
- Use 'git-dumper' to pull the entire history tree.
- Extract database credentials, OpenAI keys, and AWS access tokens.`
    };
  },

  trufflehog: (target) => {
    return {
      output: `🐷 TruffleHog OSS - High-Entropy Secret Scanner
Scan target: ${target}

[Detector: AWS]
  Decoder Type: PLAIN
  Raw result: AKIAIOSFODNN7EXAMPLE
  File: configs/deployment.yaml:14
  Verified: Verified against AWS STS (Valid Active Key)

[Detector: OpenAI API Key]
  Decoder Type: PLAIN
  Raw result: sk-proj-94j8fa0f0... (redacted)
  File: src/services/llm.js:8
  Verified: TRUE (Org ID: org-nullai-prod)

[Detector: Supabase Service Role Key]
  Decoder Type: JWT
  Raw result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  File: env.production:22
  Verified: TRUE (Admin DB Bypass Permission)

Summary: 3 verified credentials found with unrestricted administrative privileges.`,
      analysis: `[AI THREAT INTEL ENGINE]
Confirmed critical vulnerability: 3 active administrative keys exposed in target asset.
- AWS Key: IAM Account takeover risk.
- Supabase Service Role Key: Bypasses Row Level Security (RLS) across all user tables.
Mitigation Protocol:
1. Immediately rotate exposed AWS, OpenAI, and Supabase tokens.
2. Invalidate existing sessions in Supabase Auth.`
    };
  },

  searchsploit: (target) => {
    return {
      output: `----------------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                           |  Path
----------------------------------------------------------------------------------------- ---------------------------------
 Nginx 1.24.0 - Memory Corruption in HTTP/3 QUIC (PoC)                                   | multiple/dos/51892.py
 OpenSSH 8.9p1 - 'RegreSSHion' Remote Code Execution (CVE-2024-6387)                      | linux/remote/52012.c
 FastAPI / Starlette < 0.28.0 - Denial of Service via Multipart Form (CVE-2023-46136)     | python/dos/51940.py
 PostgreSQL 14.x - Arbitrary Command Execution via Extension Injection                  | linux/local/50811.sql
----------------------------------------------------------------------------------------- ---------------------------------
Shellcodes: No Results
Papers: 2 Results for Linux Exploit Mitigation Bypass`,
      analysis: `[AI CVE CORRELATION & ATTACK GRAPH]
High Probability Exploit Paths:
1. CVE-2024-6387 ('RegreSSHion') on OpenSSH: Race condition in signal handler leading to unauthenticated RCE on glibc-based Linux.
2. PostgreSQL 14.x extension injection: Exploitable post-SQLi for local privilege escalation.
Recommended Defensive Action: Apply vendor security patch Ubuntu USN-6859-1 for OpenSSH immediately.`
    };
  }
};

// Generic simulation for any other tool
export const getFallbackSimulation = (toolId, target) => {
  if (toolSimulators[toolId.toLowerCase()]) {
    return toolSimulators[toolId.toLowerCase()](target);
  }
  return {
    output: `[HEXSTRIKE DISPATCH] Executing ${toolId.toUpperCase()} against target: ${target}
[ENGINE] Initializing scanner modules (threads=8, timeout=30s)...
[DISCOVERY] Resolved target host [${target}] --> 198.51.100.77
[PROBE-1] Checking connectivity and protocol responsiveness... OK (12ms)
[PROBE-2] Fuzzing header parameters and metadata headers...
[RESULT] Target responded with HTTP/2 200 OK.
[TELEMETRY] 142 vectors evaluated. 2 potential policy deviations discovered.
[STATUS] Execution finished with exit code 0.`,
    analysis: `[AI AGENT DEEP ANALYSIS]
Tool '${toolId}' execution against '${target}' completed successfully.
- Baseline asset response indicates active HTTP/2 service with modern TLS configuration.
- Recommend chaining this intelligence with 'amass' and 'searchsploit' to evaluate full attack surface.`
  };
};

// Parser and executor for terminal CLI commands
export const executeCliCommand = async (cmdString, options = {}) => {
  const trimmed = cmdString.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (command) {
    case 'help': {
      const cat = args[0] ? args[0].toLowerCase() : 'all';
      return {
        type: 'help',
        command: trimmed,
        output: `
===================================================================================
                       HEXSTRIKE NEURAL TERMINAL CLI COMMANDS
===================================================================================
COMMAND               SYNTAX & EXAMPLES                            DESCRIPTION
-----------------------------------------------------------------------------------
help [category]       help, help --recon, help --exploit           Display interactive command manual
scan <target>         scan target.io -m full -p 80,443,9000        Multi-vector OSINT / Port / CVE scan
exploit <cve|target>  exploit CVE-2024-6387 -t 10.0.0.1            Simulate vulnerability exploit & payload
neural-net [opts]     neural-net --weights --benchmark             Introspect AI cognitive weights & latency
matrix [opts]         matrix --speed 1.5 --density 40              Configure / toggle Hex Matrix rain backdrop
agent-status          agent-status                                 Real-time sub-agent telemetry HUD
synth [action]        synth beep, synth chord, synth radar         Web Audio API sound generator triggers
theme <name>          theme red, theme green, theme amber, purple  Switch terminal phosphor palette
speed <speed>         speed instant, speed fast, speed normal      Adjust typewriter execution speed
audio <on|off>        audio on, audio off                          Toggle mechanical audio synthesizer
crt <on|off>          crt on, crt off                              Toggle CRT scanlines & phosphor curve
history               history                                      List recent command execution history
clear                 clear, cls, Ctrl+L                           Wipe terminal display logs
export [txt|json]     export json                                  Export active strike audit logs to file
===================================================================================
[TIP] Use TAB for auto-completion, UP/DOWN arrows for command history navigation.
`,
        analysis: `[SYSTEM INTEL] Ready for operator dispatch. Type 'scan <target>' or select a tool above.`
      };
    }

    case 'scan': {
      const target = args.find(a => !a.startsWith('-')) || 'target.corp';
      const mode = args.includes('-m') ? args[args.indexOf('-m') + 1] : 'deep';
      return {
        type: 'scan',
        command: trimmed,
        target,
        output: `
[+] INITIATING MULTI-VECTOR RADAR SCAN: ${target} [MODE: ${mode.toUpperCase()}]
-----------------------------------------------------------------------------------
[1/4] DNS Reconnaissance & BGP Routing:
      • NS: ns1.${target}, ns2.${target} (Route53)
      • MX: inbound-smtp.${target} (Priority 10)
      • TXT: "v=spf1 include:_spf.google.com ~all"
      • Direct Host IP: 198.51.100.92 (AS13335)

[2/4] High-Speed Port Matrix Audit:
      [22/TCP]   OPEN  SSH-2.0-OpenSSH_8.9p1
      [80/TCP]   OPEN  HTTP/1.1 301 Moved Permanently
      [443/TCP]  OPEN  TLSv1.3 ECDHE-RSA-AES256-GCM-SHA384
      [3000/TCP] OPEN  Node.js Express / Next.js Telemetry API
      [6379/TCP] OPEN  Redis Core 7.2.4 (Unauthenticated access probe: BLOCKED)
      [8000/TCP] OPEN  FastAPI LocalAI Neural Bridge

[3/4] CVE Correlation Matrix:
      • CVE-2024-6387 (Score: 8.1 HIGH) - OpenSSH Race Condition Signal Handler
      • CVE-2023-44487 (Score: 7.5 HIGH) - HTTP/2 Rapid Reset Vector

[4/4] Asset Exposure Risk Index:
      [RISK LEVEL]: ELEVATED (7.8/10.0) | 6 Open Endpoints | 2 Potential Zero-Day Vectors
-----------------------------------------------------------------------------------
Scan completed in 1.48s. Strike package recommendations generated.`,
        analysis: `[AI NEURAL COPILOT]
Primary Target Weakness Identified:
- Port 3000 and Port 8000 expose administrative application logic.
- Potential Next.js middleware bypass vector on '/api/telemetry' routes.
Execute command 'exploit -t ${target} -p api-bypass' to simulate verification.`
      };
    }

    case 'exploit': {
      const target = args.find(a => !a.startsWith('-')) || '198.51.100.92';
      return {
        type: 'exploit',
        command: trimmed,
        target,
        output: `
[⚡ EXPLOIT SYNTHESIZER ENGINE]
Target Vector: ${target}
Payload Class: Memory Injection & API Session Hijack
-----------------------------------------------------------------------------------
[PHASE 1: HEURISTIC PROBE]
Sending crafted multi-part HTTP/2 frame payload...
[+] Response header received: Server: uvicorn/0.27.0
[+] Memory offset alignment calibrated: 0x7ffd8a9b2100

[PHASE 2: PAYLOAD DISPATCH]
[PAYLOAD]:
00000000  48 31 f6 56 48 bf 2f 62  69 6e 2f 2f 73 68 57 48  |H1.VH./bin//shWH|
00000010  89 e7 57 56 48 89 e6 48  31 d2 48 c7 c0 3b 00 00  |..WVH..H1.H..;..|
00000020  00 0f 05                                         |...|

[PHASE 3: SIMULATED VERIFICATION]
[✓] Shellcode staged in target buffer memory.
[✓] Non-destructive beacon verified: UID=1001 (app-runner) GID=1001 (app-group)
[✓] Exploit viability: 99.4% (Confirmed in sandbox simulation).
-----------------------------------------------------------------------------------
Exploit simulation completed safely with Zero Lateral Disruption.`,
        analysis: `[DEFENSIVE REMEDIATION ADVICE]
To prevent this vulnerability in production environments:
1. Compile binaries with '-fstack-protector-all' and ASLR enabled.
2. Enforce strict Content-Security-Policy with nonces on all HTML responses.
3. Isolate application containers with read-only root filesystems.`
      };
    }

    case 'neural-net': {
      return {
        type: 'neural-net',
        command: trimmed,
        output: `
[🧠 LOCAL NEURAL CORE - MATRIX STATUS & WEIGHT TELEMETRY]
===================================================================================
Model Architecture:       Hermes-3-Llama-3-8B (Quantized Q4_K_M)
Inference Engine:         LocalAI C++ Runtime (AVX-512 Optimized)
Active Parameters:        8,030,261,248 weights
VRAM Footprint:           4.82 GB / 6.00 GB (80.3% allocated)
Context Window Size:      8,192 tokens
Token Throughput:         48.6 tokens/sec (CPU Inference)
Perplexity Score:         5.12 (Optimal Reasoning State)

[ACTIVATION LAYER BENCHMARK]:
Layer 01 [Self-Attention]:     ████████████████████ 98.4%
Layer 08 [Feed-Forward 1]:     ███████████████▒▒▒▒▒ 74.2%
Layer 16 [Cross-Attention]:    ██████████████████▒▒ 89.1%
Layer 24 [Feed-Forward 2]:     ████████████████████ 96.7%
Layer 32 [Output Projection]:  ████████████████▒▒▒▒ 81.3%

Active Cognition State: READY | Autonomous Defensive Planning Enabled.
===================================================================================`,
        analysis: `[NEURAL CORE DIAGNOSTICS]
All 32 transformer layers operating within nominal temperature thresholds (0.7).
Top-P nucleus sampling locked at 0.9. Zero context truncation detected.`
      };
    }

    case 'agent-status': {
      return {
        type: 'agent-status',
        command: trimmed,
        output: `
[🤖 HEXSTRIKE AUTONOMOUS AGENT ORCHESTRATOR TELEMETRY]
===================================================================================
AGENT ID          ROLE                STATE       CPU%   RAM    TASKS COMPLETED
-----------------------------------------------------------------------------------
AGENT-RECON-01    OSINT & DNS Map     MONITORING  12.4%  180MB  1,429
AGENT-VULN-02     CVE Fingerprint     ACTIVE      28.7%  420MB  892
AGENT-EXPLOIT-03  Payload Sandbox     IDLE        2.1%   95MB   318
AGENT-NEURAL-04   Cognitive Analysis  INFERRING   64.2%  2.1GB  2,044
AGENT-DEFENSE-05  Remediation Patch   VERIFIED    5.0%   110MB  610
===================================================================================
SWARM PROTOCOL: P2P Gossip Active | Sync Latency: 4ms | Total Cluster Health: 99.8%`,
        analysis: `[SWARM METRICS]
All 5 specialized sub-agents are operating synchronously. Cluster load balanced across all worker threads.`
      };
    }

    case 'matrix': {
      return {
        type: 'matrix',
        command: trimmed,
        output: `[HEX MATRIX ENGINE] Background rain parameters updated. Matrix density & speed adjusted.`,
        analysis: `Hex code rain visualizer active.`
      };
    }

    case 'synth': {
      const mode = args[0] || 'chord';
      return {
        type: 'synth',
        command: trimmed,
        output: `[AUDIO SYNTH] Web Audio synthesizer triggered mode: '${mode.toUpperCase()}'. Generated cyber harmonic pulse.`,
        analysis: `Audio frequency synthesizer active.`
      };
    }

    case 'clear':
    case 'cls': {
      return { type: 'clear' };
    }

    case 'history': {
      return {
        type: 'history',
        command: trimmed,
        output: `Use Arrow Up / Arrow Down keys to navigate interactive history stack.`,
        analysis: `Command history loaded.`
      };
    }

    default: {
      return {
        type: 'error',
        command: trimmed,
        output: `[ERROR] Unknown command: '${command}'. Type 'help' for available HexStrike commands or select a security tool from the dropdown.`,
        analysis: `Command parser encountered an unrecognized directive.`
      };
    }
  }
};
