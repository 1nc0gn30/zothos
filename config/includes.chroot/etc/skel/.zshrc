# ~/.zshrc: executed by zsh for interactive shells.
# ZOTHOS — The Alchemical & Security Distro
# Prompt v3.0: Living Reactive HUD — Mode-aware, glitch-reactive

export HISTFILE=~/.zsh_history
export HISTSIZE=10000
export SAVEHIST=20000
setopt appendhistory
setopt sharehistory
setopt incappendhistory
setopt extendedglob

alias grep='grep --color=auto'
alias ls='ls --color=auto'
alias ll='ls -lah --time-style=long-iso'
alias la='ls -Ah'
alias l='ls -CF'
alias zoth='zoth-ai'
alias ghost='zoth-ghost'
alias undercover='zoth-undercover'
alias win11='zoth-mode incognito'
alias matrix='zoth-mode matrix'
alias rain='zoth-matrix-rain'
alias sec='zoth-sec'
alias fetch='zoth-fastfetch'
alias panic='zoth-quicklock'

export PATH="/usr/local/bin:/opt/zothos-ai-env/bin:$HOME/.local/bin:$PATH"

# ── Mode-aware color palette ────────────────────────────────────────────────
get_zoth_mode() {
    local m="matrix"
    if [[ -f "$HOME/.config/zothos/current_mode" ]]; then
        m=$(cat "$HOME/.config/zothos/current_mode" 2>/dev/null || echo "matrix")
    fi
    echo "$m"
}

mode_colors() {
    local mode=$(get_zoth_mode)
    case "$mode" in
        matrix)    echo "%F{48}%F{214}%F{51}" ;;  # emerald:gold:cyan
        ghost)     echo "%F{196}%F{177}%F{135}" ;;  # crimson:violet:slate
        incognito) echo "%F{39}%F{214}%F{51}" ;;  # winblue:gold:cyan
        *)         echo "%F{48}%F{214}%F{51}" ;;
    esac
}

# ── ZOTHOS Living Powerline Prompt v3.0 (ZSH) ─────────────────────────────
#  ┌──(🜂 ZOTH 🜄)-[user@host]-[path] [git] │ 00:17:23 │ ⚡3.2GHz │
#  └─➤ $

_build_zsh_prompt() {
    local mode=$(get_zoth_mode)
    local c1 c2 c3
    c1=$(mode_colors | cut -d' ' -f1)
    c2=$(mode_colors | cut -d' ' -f2)
    c3=$(mode_colors | cut -d' ' -f3)

    local mode_glyph="🜂"
    case "$mode" in
        ghost) mode_glyph="👻" ;;
        incognito) mode_glyph="🪟" ;;
    esac

    local git_info=""
    if git rev-parse --git-dir >/dev/null 2>&1; then
        local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
        local dirty=""
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            dirty=" ✗"
        fi
        git_info=" [${branch}${dirty}]"
    fi

    local now=$(date +"%H:%M:%S")

    PROMPT=""
    PROMPT+="%F{$c1}┌──(%F{$c2}${mode_glyph} ZOTHOS 🜄%F{$c1})──[%F{$c3}%n@%m%F{$c1}]──[%F{$c3}%~${git_info}%F{$c1}]%f"$'\n'
    PROMPT+="%F{$c1}└─➤ %F{$c3}$%f "
}

precmd() {
    _build_zsh_prompt
}

# ── Run ZOTH fastfetch on interactive terminal launch ─────────────────────
if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "$ZOTH_FASTFETCH_SHOWN" ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
