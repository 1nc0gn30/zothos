#!/usr/bin/env python3
"""
==============================================================================
 * HEXSTRIKE AI v6.0 — MASTER MODEL CONTEXT PROTOCOL (MCP) SERVER *
 Exposes sovereign cybersecurity strikes, target intelligence, and neural
 vulnerability analyzers to AI agents via standard JSON-RPC 2.0 stdio MCP.
==============================================================================
"""

import sys
import os
import json
import asyncio
import argparse

# Add backend directory to path
CUR_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(CUR_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if CUR_DIR not in sys.path:
    sys.path.insert(0, CUR_DIR)

try:
    from backend.core.hex_bridge import HexBridge
except ImportError:
    from core.hex_bridge import HexBridge


TOOLS_SCHEMA = [
    {
        "name": "hexstrike_execute_strike",
        "description": "Execute a cybersecurity tool (nmap, nikto, sqlmap, gobuster, etc.) against a target domain/IP and analyze vulnerabilities.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tool": {
                    "type": "string",
                    "description": "Tool to run (e.g. nmap, nikto, sqlmap, gobuster, sublist3r, whatweb, hydra, searchsploit, wafw00f, xsstrike, amass)"
                },
                "target": {
                    "type": "string",
                    "description": "Target hostname, IP address, or URL (e.g. 192.168.1.1, scanme.nmap.org)"
                }
            },
            "required": ["tool", "target"]
        }
    },
    {
        "name": "hexstrike_get_intel",
        "description": "Retrieve accumulated target intelligence, past strikes, and vulnerability findings.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "target": {
                    "type": "string",
                    "description": "Target hostname or IP address to query"
                }
            },
            "required": ["target"]
        }
    },
    {
        "name": "hexstrike_ai_analyze",
        "description": "Analyze raw terminal/security tool output using local AI and offline heuristic vulnerability rules.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "tool": {
                    "type": "string",
                    "description": "Tool name that produced the output"
                },
                "target": {
                    "type": "string",
                    "description": "Target domain/IP"
                },
                "output": {
                    "type": "string",
                    "description": "Raw terminal output to inspect"
                }
            },
            "required": ["tool", "target", "output"]
        }
    },
    {
        "name": "hexstrike_generate_report",
        "description": "Generate a comprehensive penetration testing report for a target.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "target": {
                    "type": "string",
                    "description": "Target hostname or IP address"
                }
            },
            "required": ["target"]
        }
    }
]


class HexStrikeMCPServer:
    def __init__(self, server_url="http://127.0.0.1:8000"):
        self.server_url = server_url
        self.bridge = HexBridge()

    async def handle_tool_call(self, name, arguments):
        if name == "hexstrike_execute_strike":
            tool = arguments.get("tool", "nmap")
            target = arguments.get("target", "127.0.0.1")
            result = await self.bridge.execute_and_analyze(tool, target)
            return {
                "content": [
                    {"type": "text", "text": f"Output:\n{result.get('output', '')}\n\nAI Analysis:\n{result.get('analysis', '')}"}
                ]
            }

        elif name == "hexstrike_get_intel":
            target = arguments.get("target", "")
            intel = self.bridge._get_target_intel(target)
            return {
                "content": [
                    {"type": "text", "text": json.dumps(intel, indent=2, default=str)}
                ]
            }

        elif name == "hexstrike_ai_analyze":
            tool = arguments.get("tool", "recon")
            target = arguments.get("target", "target")
            output = arguments.get("output", "")
            analysis = self.bridge.ask_local_ai_with_context(tool, target, output)
            return {
                "content": [
                    {"type": "text", "text": analysis}
                ]
            }

        elif name == "hexstrike_generate_report":
            target = arguments.get("target", "")
            intel = self.bridge._get_target_intel(target)
            report = f"# HexStrike Sovereign Audit Report: {target}\n"
            report += f"Generated: {asyncio.get_event_loop().time()}\n\n"
            report += f"## Strike History ({len(intel.get('history', []))} actions)\n"
            for h in intel.get("history", []):
                report += f"### {h.get('tool')} ({h.get('timestamp')})\n```\n{h.get('output', '')[:800]}\n```\n\n"
            return {
                "content": [
                    {"type": "text", "text": report}
                ]
            }

        else:
            raise ValueError(f"Unknown tool: {name}")

    async def run(self):
        reader = asyncio.StreamReader()
        protocol = asyncio.StreamReaderProtocol(reader)
        await asyncio.get_event_loop().connect_read_pipe(lambda: protocol, sys.stdin)

        while True:
            line = await reader.readline()
            if not line:
                break
            
            try:
                msg = json.loads(line.decode('utf-8'))
            except Exception:
                continue

            msg_id = msg.get("id")
            method = msg.get("method")
            params = msg.get("params", {})

            if method == "initialize":
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {
                            "tools": {}
                        },
                        "serverInfo": {
                            "name": "hexstrike-ai",
                            "version": "6.0.0"
                        }
                    }
                }
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()

            elif method == "notifications/initialized":
                pass

            elif method == "tools/list":
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {
                        "tools": TOOLS_SCHEMA
                    }
                }
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()

            elif method == "tools/call":
                tool_name = params.get("name")
                tool_args = params.get("arguments", {})
                try:
                    res = await self.handle_tool_call(tool_name, tool_args)
                    response = {
                        "jsonrpc": "2.0",
                        "id": msg_id,
                        "result": res
                    }
                except Exception as err:
                    response = {
                        "jsonrpc": "2.0",
                        "id": msg_id,
                        "error": {
                            "code": -32603,
                            "message": str(err)
                        }
                    }
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()

            elif method == "ping":
                response = {
                    "jsonrpc": "2.0",
                    "id": msg_id,
                    "result": {}
                }
                sys.stdout.write(json.dumps(response) + "\n")
                sys.stdout.flush()


def main():
    parser = argparse.ArgumentParser(description="HexStrike AI MCP Server")
    parser.add_argument("--server", default="http://127.0.0.1:8000", help="HexStrike backend URL")
    args = parser.parse_args()

    server = HexStrikeMCPServer(server_url=args.server)
    asyncio.run(server.run())


if __name__ == "__main__":
    main()
