# Ollama Cloud Models

## Purpose

Track Ollama cloud model tags used by Codex Workbench Linux launcher presets.

These tags power the UI datalist and preferred model chips for the `ollama launch codex` path.

## Source And Freshness

Current list was researched from Ollama's official cloud search and model tag pages on:

```text
2026-05-15
```

Model availability can change. Treat this note as a snapshot, not a permanent source of truth.

Before a public release or major README update, refresh from official Ollama pages and update:

- `codex_workbench_linux/static/app.js`
- `README.md`
- this note

## Command Shape

Basic launcher:

```bash
ollama launch codex --model deepseek-v4-pro:cloud
```

Fast launcher:

```bash
ollama launch codex --model deepseek-v4-flash:cloud
```

Forwarding Codex CLI arguments:

```bash
ollama launch codex --model deepseek-v4-pro:cloud -- --no-alt-screen --cd ~/project --sandbox workspace-write
```

With an explicit workspace:

```bash
ollama launch codex --model qwen3-coder:480b-cloud -- --no-alt-screen --cd /home/neo/project --sandbox workspace-write
```

## Product Defaults

Recommended default:

```text
deepseek-v4-pro:cloud
```

Reason:

- positioned in this app as the high-capability default
- suitable for coding-agent sessions where quality matters more than latency

Recommended fast option:

```text
deepseek-v4-flash:cloud
```

Reason:

- useful when the user wants quicker iteration
- should remain visible as a chip

Recommended coding-specific option:

```text
qwen3-coder:480b-cloud
```

Reason:

- clearly coding-oriented tag
- useful as an alternate preset for repo-heavy tasks

## Current Preferred Chips

These are the high-visibility presets currently shown as chips in the UI:

```text
deepseek-v4-pro:cloud
deepseek-v4-flash:cloud
qwen3-coder:480b-cloud
gpt-oss:120b-cloud
minimax-m2.7:cloud
kimi-k2.6:cloud
```

Keep the chip list short. The full datalist can be longer, but chips should feel curated.

## Full Cloud Tag Snapshot

```text
cogito-2.1:671b-cloud
deepseek-v3.1:671b-cloud
deepseek-v3.2:cloud
deepseek-v4-flash:cloud
deepseek-v4-pro:cloud
devstral-2:123b-cloud
devstral-small-2:24b-cloud
gemini-3-flash-preview:cloud
gemma3:4b-cloud
gemma3:12b-cloud
gemma3:27b-cloud
gemma4:31b-cloud
glm-4.6:cloud
glm-4.7:cloud
glm-5:cloud
glm-5.1:cloud
gpt-oss:20b-cloud
gpt-oss:120b-cloud
kimi-k2:1t-cloud
kimi-k2-thinking:cloud
kimi-k2.5:cloud
kimi-k2.6:cloud
minimax-m2:cloud
minimax-m2.1:cloud
minimax-m2.5:cloud
minimax-m2.7:cloud
ministral-3:3b-cloud
ministral-3:8b-cloud
ministral-3:14b-cloud
mistral-large-3:675b-cloud
nemotron-3-nano:30b-cloud
nemotron-3-super:cloud
qwen3-coder:480b-cloud
qwen3-coder-next:cloud
qwen3-next:80b-cloud
qwen3-vl:235b-cloud
qwen3-vl:235b-instruct-cloud
qwen3.5:cloud
qwen3.5:397b-cloud
rnj-1:8b-cloud
```

## Maintenance Checklist

When refreshing model tags:

- verify against official Ollama model/tag pages
- remove unavailable tags
- add new high-value coding tags
- keep default model stable unless there is a strong reason
- update `cloudModels` in `codex_workbench_linux/static/app.js`
- update `preferredModels` only if the chip set should change
- update README cloud model section if it still lists tags
- note refresh date here

## User-Facing Copy Guidance

Use cautious wording:

- "model presets"
- "cloud tag snapshot"
- "refresh before release"

Avoid:

- "all supported models" unless verified current
- "latest" unless checked during the same work session
- implying Ollama cloud availability is controlled by this project
