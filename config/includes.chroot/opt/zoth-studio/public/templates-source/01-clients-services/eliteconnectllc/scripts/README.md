# AI Agent Command System

Run specialized AI agents with pre-loaded context for the Elite Connect website.

## Quick Start

```bash
# Show all available agents
npm run agent

# Run a specific agent with a prompt
npm run agent:design -- "Make the navbar sticky on scroll"
npm run agent:seo -- "Update all meta descriptions for service pages"
npm run agent:astro -- "Add a new page for Network WiFi Solutions"
npm run agent:forms -- "Add email confirmation to the contact form"
npm run agent:qa -- "Check Lighthouse scores and list issues"
```

Or use the shell script directly:

```bash
./scripts/agent design "Make service cards lift more on hover"
./scripts/agent seo "Add location keywords to all page titles"
./scripts/agent forms "Fix the lead modal close button"
```

## How It Works

1. Each agent loads its skill definition from `.agents/{agent-name}/SKILL.md`
2. Prepends project context (Astro, file paths, Netlify)
3. Appends your prompt
4. Outputs a complete prompt ready for any AI assistant

If you have the [Codex CLI](https://github.com/openai/codex) installed, it runs automatically.

## Available Agents

| Command | Agent | Best For |
|---|---|---|
| `npm run agent:design` | Frontend Designer | CSS, animations, responsive, dark mode, layout |
| `npm run agent:seo` | Content & SEO | Meta tags, copy, keywords, schema markup |
| `npm run agent:astro` | Astro Developer | Components, routing, data, build config |
| `npm run agent:forms` | Forms & Integrations | Netlify forms, lead modal, submissions |
| `npm run agent:qa` | QA & Performance | Testing, Lighthouse, accessibility, bugs |

## Agent Prompts

Each agent prompt includes:
- **Skill context** — what the agent owns and its constraints
- **Project context** — Astro framework, file paths, deployment info
- **Instructions** — read first, edit minimally, update docs, test changes
- **Your request** — the specific task you want done

## Installing Codex CLI (Optional)

For automatic execution instead of copy-paste:

```bash
npm install -g @openai/codex
```

Then `npm run agent:design -- "your prompt"` will run directly in Codex.
