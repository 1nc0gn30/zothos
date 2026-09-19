# ~/.bashrc: executed by bash(1) for non-login shells.
# ═══════════════════════════════════════════════════════════════════════════════
#  🜂 ZOTHOS APEX LIVING POWERLINE HUD — BASH CONFIGURATION 🜄
#  Reactive reality prompt, git status telemetry, exit code tracking, alchemical glyphs
# ═══════════════════════════════════════════════════════════════════════════════

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

# ── Color & Utility Aliases ────────────────────────────────────────────────
export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01;quote=01'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias ls='ls --color=auto'
alias ll='ls -lah --time-style=long-iso'
alias la='ls -Ah'
alias l='ls -CF'
alias tree='tree -C --dirsfirst'

# ── Master ZOTHOS Aliases ──────────────────────────────────────────────────
alias zoth-heal='sudo /usr/local/bin/zoth-heal'
alias zoth-doctor='/usr/local/bin/zoth-doctor'
alias zoth-cockpit='/usr/local/bin/zoth-cockpit'
alias zoth-ai='/usr/local/bin/zoth-ai'
alias zoth-sec='/usr/local/bin/zoth-sec'
alias hexstrike='/usr/local/bin/hexstrike'
alias maya='/usr/local/bin/maya'
alias zoth-mode='/usr/local/bin/zoth-mode'
alias zoth-ghost='/usr/local/bin/zoth-ghost'

# Convenient Short Handlers
alias zoth='zoth-ai'
alias ai='zoth-ai'
alias sec='zoth-sec'
alias cockpit='zoth-cockpit'
alias doctor='zoth-doctor'
alias heal='sudo zoth-heal'
alias ghost='zoth-ghost'
alias undercover='zoth-undercover'
alias win11='zoth-mode incognito'
alias matrix='zoth-mode matrix'
alias gold='zoth-mode gold'
alias rain='zoth-matrix-rain'
alias fetch='zoth-fastfetch'
alias panic='zoth-quicklock'
alias netkill='zoth-netkill'

# ── Environment & PATH ─────────────────────────────────────────────────────
export PATH="/usr/local/bin:/opt/zothos-ai-env/bin:$HOME/.local/bin:$PATH"

# ── Reality Mode Detection & Palette ───────────────────────────────────────
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
        matrix)
            echo "38;5;48:38;5;214:38;5;51:🜂"   # Emerald : Gold : Cyan : Fire Glyph
            ;;
        ghost)
            echo "38;5;196:38;5;177:38;5;135:👻" # Crimson : Violet : Slate : Ghost Glyph
            ;;
        gold)
            echo "38;5;220:38;5;214:38;5;51:🜀"  # Bright Gold : Amber : Cyan : Quintessence Glyph
            ;;
        incognito|win11)
            echo "38;5;39:38;5;214:38;5;51:🪟"   # Windows Blue : Gold : Cyan : Window Glyph
            ;;
        *)
            echo "38;5;48:38;5;214:38;5;51:🜂"
            ;;
    esac
}

# ── Git Status Telemetry ───────────────────────────────────────────────────
_get_git_info() {
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        local branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
        local dirty=""
        if ! git diff --quiet --ignore-submodules HEAD 2>/dev/null; then
            dirty="⚡*"
        elif ! git diff --cached --quiet --ignore-submodules 2>/dev/null; then
            dirty="+"
        fi
        echo " [${branch}${dirty}]"
    fi
}

# ── ZOTHOS Living Powerline Prompt Builder ─────────────────────────────────
#  ┌──(🜂 ZOTHOS:MATRIX 🜄)─[neo@zothos]─[~/workspace [main*]]─[✦ 16:50:01]
#  └──>> $
_build_zoth_prompt() {
    local exit_code=$?
    local mode_info=$(mode_colors)
    local c1=$(echo "$mode_info" | cut -d: -f1)
    local c2=$(echo "$mode_info" | cut -d: -f2)
    local c3=$(echo "$mode_info" | cut -d: -f3)
    local glyph=$(echo "$mode_info" | cut -d: -f4)
    local mode=$(get_zoth_mode)

    local mode_tag="MATRIX"
    case "$mode" in
        ghost) mode_tag="GHOST" ;;
        gold) mode_tag="GOLD" ;;
        incognito|win11) mode_tag="WIN11" ;;
    esac

    # Exit code glyph
    local status_badge="\[\e[38;5;48m\]✦"
    if [[ $exit_code -ne 0 ]]; then
        status_badge="\[\e[38;5;196m\]✗[${exit_code}]"
    fi

    local git_str=$(_get_git_info)
    local timestamp=$(date +"%H:%M:%S")
    local reset="\[\e[0m\]"

    PS1="${reset}\[\e[${c1}m\]┌──(\[\e[${c2}m\]${glyph} ZOTHOS:${mode_tag} 🜄\[\e[${c1}m\])─[\[\e[${c3}m\]\u@\h\[\e[${c1}m\]]─[\[\e[${c3}m\]\w${git_str}\[\e[${c1}m\]]─[${status_badge} \[\e[${c2}m\]${timestamp}\[\e[${c1}m\]]\n\[\e[${c1}m\]└──>> \[\e[${c3}m\]\$ ${reset}"
}

PROMPT_COMMAND="_build_zoth_prompt"

# ── Launch Fastfetch Greeting on Interactive Shell Start ───────────────────
if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "${ZOTH_FASTFETCH_SHOWN:-}" ]] && [[ $- == *i* ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
