# bash completion for zoth CLI
# Generated for Zoth Studio Sovereign Workstation Suite

_zoth_completions() {
    local cur prev words cword
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    local commands="start stop status tui doctor list run update help"
    local global_opts="-h --help"

    # Complete root command
    if [ "$COMP_CWORD" -eq 1 ]; then
        if [[ "$cur" == -* ]]; then
            COMPREPLY=( $(compgen -W "${global_opts}" -- "${cur}") )
        else
            COMPREPLY=( $(compgen -W "${commands}" -- "${cur}") )
        fi
        return 0
    fi

    local cmd="${COMP_WORDS[1]}"

    case "${cmd}" in
        list)
            if [[ "$cur" == -* ]]; then
                COMPREPLY=( $(compgen -W "--summary -c --category -h --help" -- "${cur}") )
                return 0
            fi
            if [[ "$prev" == "-c" || "$prev" == "--category" ]]; then
                local categories=(
                    "Security Operations & OSINT"
                    "Creative & Media"
                    "Netlify & Creator Tools"
                    "AI Agents & LLM"
                    "Games & Experiments"
                    "Workspaces"
                    "Learning & Courses"
                    "Client Services"
                    "Crypto & Web3"
                    "Portfolio & Agency"
                    "Rust Projects"
                    "Automation & Tools"
                    "Python Tools"
                    "Web Apps & SaaS"
                )
                local IFS=$'\n'
                COMPREPLY=( $(compgen -W "${categories[*]}" -- "${cur}") )
                return 0
            fi
            ;;

        run)
            if [[ "$cur" == -* ]]; then
                COMPREPLY=( $(compgen -W "--confirm -h --help" -- "${cur}") )
                return 0
            fi
            # First positional argument after run: tool ID
            if [ "$COMP_CWORD" -eq 2 ] || { [ "$COMP_CWORD" -eq 3 ] && [ "${COMP_WORDS[2]}" == "--confirm" ]; }; then
                local tool_list=""
                # Attempt to query orchestrator list if python3 / zoth is available
                if command -v zoth >/dev/null 2>&1; then
                    tool_list=$(zoth list 2>/dev/null | grep -E '^[a-zA-Z0-9_-]+' | awk '{print $1}')
                fi
                if [ -z "$tool_list" ]; then
                    tool_list="local_null_ai_subsweep local_null_ai_omnipost local_null_ai_site_foundry local_null_ai_consensus local_null_ai_vault local_null_ai_3d_editor 757-gas-shop-app omnipost subsweep"
                fi
                COMPREPLY=( $(compgen -W "${tool_list}" -- "${cur}") )
                return 0
            fi
            ;;

        doctor|tui|start|stop|status|update)
            if [[ "$cur" == -* ]]; then
                COMPREPLY=( $(compgen -W "-h --help" -- "${cur}") )
                return 0
            fi
            ;;

        *)
            ;;
    esac
}

complete -F _zoth_completions zoth
