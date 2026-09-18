#compdef zoth
# Zsh completion for Zoth Studio CLI

_zoth_categories() {
    local -a categories
    categories=(
        'Security Operations & OSINT:Passive recon and vulnerability intelligence'
        'Creative & Media:Video, motion graphics, audio and procedural synthesis'
        'Netlify & Creator Tools:Edge functions, serverless backends and landing apps'
        'AI Agents & LLM:Autonomous models, swarms and prompt pipelines'
        'Games & Experiments:Kinetic 3D simulations and algorithmic playgrounds'
        'Workspaces:Multi-node workspace topologies and environments'
        'Learning & Courses:Self-directed developer roadmaps and blueprints'
        'Client Services:Production business applications and client portals'
        'Crypto & Web3:Solana wallets, token contracts and dApps'
        'Portfolio & Agency:Showcases, blikis and interactive resumes'
        'Rust Projects:High-performance cryptography and system daemons'
        'Automation & Tools:CLI tools, cron workers and scraper harnesses'
        'Python Tools:Data engineering, PyTorch and ML pipelines'
        'Web Apps & SaaS:Full-stack web applications and micro-SaaS'
    )
    _describe -t categories 'tool category' categories
}

_zoth_tools() {
    local -a tool_list
    if command -v zoth >/dev/null 2>&1; then
        tool_list=(${(f)"$(zoth list 2>/dev/null | grep -E '^[a-zA-Z0-9_-]+' | awk '{print $1}')"})
    fi
    if (( ${#tool_list} == 0 )); then
        tool_list=(
            'local_null_ai_subsweep:Passive OSINT Recon Suite'
            'local_null_ai_omnipost:OmniPost 2.0 60 FPS Video Studio'
            'local_null_ai_site_foundry:Multi-Framework Web Foundry'
            'local_null_ai_consensus:3-Agent Consensus & AST Triangulator'
            'local_null_ai_vault:Argon2id Vault Daemon CLI'
            'local_null_ai_3d_editor:Nexus 3D Omniverse Studio'
            '757-gas-shop-app:Web3 E-Commerce Portal'
        )
        _describe -t tools 'sovereign tool' tool_list
    else
        _describe -t tools 'sovereign tool' tool_list
    fi
}

_zoth() {
    local context state state_descr line
    typeset -A opt_args

    local -a commands
    commands=(
        'start:Start all Zoth Studio servers (Orchestrator :8484, Web :8088, Previews :8787)'
        'stop:Stop all background Zoth Studio servers cleanly'
        'status:Show real-time port matrix, loopback latency and tool registry status'
        'tui:Launch interactive Terminal User Interface (TUI) cockpit'
        'doctor:Run comprehensive environment diagnostics and system audits'
        'list:List registered sovereign tools and autonomous blueprints'
        'run:Run a sovereign tool command, script or pipeline'
        'update:Pull latest updates from GitHub repository and refresh binaries'
    )

    _arguments -C \
        '(-h --help)'{-h,--help}'[Show help and usage information]' \
        '1: :->command' \
        '*:: :->args'

    case $state in
        command)
            _describe -t commands 'zoth command' commands
            ;;
        args)
            case $line[1] in
                list)
                    _arguments \
                        '--summary[Group registered tools by category]' \
                        '(-c --category)'{-c,--category}'[Filter tools by category]:category:_zoth_categories' \
                        '(-h --help)'{-h,--help}'[Show help for list command]'
                    ;;
                run)
                    _arguments \
                        '--confirm[Execute tool directly (skip dry-run mode)]' \
                        '(-h --help)'{-h,--help}'[Show help for run command]' \
                        '1:tool ID:_zoth_tools' \
                        '*:tool arguments:_default'
                    ;;
                start|stop|status|tui|doctor|update)
                    _arguments \
                        '(-h --help)'{-h,--help}'[Show help information]'
                    ;;
            esac
            ;;
    esac
}

_zoth "$@"
