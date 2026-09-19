# ~/.bashrc: executed by bash(1) for non-login shells.
# 🜂 ZOTHOS — The Alchemical & Security Distro 🜄
# Prompt v3.0: Living Reactive HUD — Mode-aware, glitch-reactive, planetary

case $- in
    *i*) ;;
      *) return;;
esac

# ── Shell History ──────────────────────────────────────────────────────────
HISTCONTROL=ignoreboth
shopt -s histappend
HISTSIZE=10000
HISTFILESIZE=20000
shopt -s checkwinsize

# ── Color aliases ──────────────────────────────────────────────────────────
export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01;quote=01'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias ls='ls --color=auto'
alias ll='ls -lah --time-style=long-iso'
alias la='ls -Ah'
alias l='ls -CF'
alias tree='tree -C --dirsfirst'

# ── Git branch parser ──────────────────────────────────────────────────────
parse_git_branch() {
    git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

# ── Get current ZOTHOS reality mode ────────────────────────────────────────
get_zoth_mode() {
    local m="matrix"
    if [[ -f "$HOME/.config/zothos/current_mode" ]]; then
        m=$(cat "$HOME/.config/zothos/current_mode" 2>/dev/null || echo "matrix")
    fi
    echo "$m"
}

# ── Mode color palette ─────────────────────────────────────────────────────
mode_colors() {
    local mode=$(get_zoth_mode)
    case "$mode" in
        matrix)
            echo "38;5;48:38;5;214:38;5;51"  # emerald : gold : cyan
            ;;
        ghost)
            echo "38;5;196:38;5;177:38;5;135"  # crimson : violet : slate
            ;;
        incognito)
            echo "38;5;39:38;5;214:38;5;51"  # windows blue : gold : cyan
            ;;
        *)
            echo "38;5;48:38;5;214:38;5;51"
            ;;
    esac
}

# ── ZOTHOS Living Powerline Prompt v3.0 ────────────────────────────────────
#  ┌──(🜂 ZOTH 🜄)-[user@host]-[path] [git] │ 00:17:23 │ ⚡3.2GHz │
#  └─➤ $
#
#  Reacts to: reality mode (color shift), git status, system load, time

_build_prompt() {
    local TIMEFMT="%H:%M:%S"
    local now=$(date +"$TIMEFMT")
    local mode=$(get_zoth_mode)
    local c1=$(echo $(mode_colors) | cut -d: -f1)
    local c2=$(echo $(mode_colors) | cut -d: -f2)
    local c3=$(echo $(mode_colors) | cut -d: -f3)
    local load=$(awk '{print int($1*100/4)}' /proc/loadavg 2>/dev/null || echo "0")
    if [[ "$load" -gt 100 ]]; then load=100; fi

    # Mode glyph
    local mode_glyph="🜂"
    case "$mode" in
        ghost) mode_glyph="👻" ;;
        incognito) mode_glyph="🪟" ;;
    esac

    # Git status
    local git_info=""
    if git rev-parse --git-dir >/dev/null 2>&1; then
        local branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
        local dirty=""
        if ! git diff-index --quiet HEAD -- 2>/dev/null; then
            dirty=" ✗"
        fi
        git_info=" [${branch}${dirty}]"
    fi

    # Load bar (visual)
    local load_bars=""
    local l=${load}
    if [[ $l -gt 0 ]]; then
        local filled=$((l / 10))
        if [[ $filled -gt 10 ]]; then filled=10; fi
        local empty=$((10 - filled))
        load_bars=$(printf '\\e[38;5;48m▓%.0s' $(seq 1 $filled))
        load_bars+=$(printf '\\e[38;5;239m░%.0s' $(seq 1 $empty))
    fi
    load_bars+=" \\e[38;5;246m${load}%\\e[0m"

    # Build the prompt
    local reset="\\e[0m"

    PS1=""
    # Line 1: Header bar
    PS1+="\\[\\e[${c1}m\\]┌──(\\[\\e[${c2}m\\]${mode_glyph} ZOTHOS 🜄\\[\\e[${c1}m\\])──[\\[\\e[${c3}m\\]\\u@\\h\\[\\e[${c1}m\\]]──\\[\\e[${c3}m\\]\\w${git_info}\\[\\e[${c1}m\\]\\]\\[${reset}\\]\n"
    PS1+="\\[\\e[${c1}m\\]└─➤ \\[\\e[${c3}m\\]\\$ \\[${reset}\\]"
}

PROMPT_COMMAND="_build_prompt"

# ── ZOTHOS aliases ─────────────────────────────────────────────────────────
alias zoth='zoth-ai'
alias cockpit='zoth-cockpit'
alias ghost='zoth-ghost'
alias undercover='zoth-undercover'
alias win11='zoth-mode incognito'
alias matrix='zoth-mode matrix'
alias rain='zoth-matrix-rain'
alias sec='zoth-sec'
alias fetch='zoth-fastfetch'
alias panic='zoth-quicklock'
alias netkill='zoth-netkill'
alias ll='ls -lah --time-style=long-iso'

# ── PATH ────────────────────────────────────────────────────────────────────
export PATH="/usr/local/bin:/opt/zothos-ai-env/bin:$HOME/.local/bin:$PATH"

# ── Run ZOTH fastfetch on interactive terminal launch ─────────────────────
if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "$ZOTH_FASTFETCH_SHOWN" ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
