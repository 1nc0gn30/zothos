# ~/.zshrc: executed by zsh for interactive shells.
# ═══════════════════════════════════════════════════════════════════════════════
#  🜂 ZOTHOS APEX LIVING POWERLINE HUD — ZSH CONFIGURATION 🜄
#  Reactive reality prompt, git status telemetry, exit code tracking, alchemical glyphs
# ═══════════════════════════════════════════════════════════════════════════════

export HISTFILE=~/.zsh_history
export HISTSIZE=10000
export SAVEHIST=20000
setopt appendhistory
setopt sharehistory
setopt incappendhistory
setopt extendedglob
setopt promptsubst

# ── Color & Utility Aliases ────────────────────────────────────────────────
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
        matrix)          echo "48:214:51:🜂" ;;
        ghost)           echo "196:177:135:👻" ;;
        gold)            echo "220:214:51:🜀" ;;
        incognito|win11) echo "39:214:51:🪟" ;;
        *)               echo "48:214:51:🜂" ;;
    esac
}

# ── Git Status Telemetry for ZSH ───────────────────────────────────────────
_zsh_git_info() {
    if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        local branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
        local dirty=""
        if ! git diff --quiet --ignore-submodules HEAD 2>/dev/null; then
            dirty="%F{196}⚡*%f"
        elif ! git diff --cached --quiet --ignore-submodules 2>/dev/null; then
            dirty="%F{214}+%f"
        fi
        echo " [%F{51}${branch}${dirty}%F{48}]"
    fi
}

# ── Build ZSH Powerline Prompt ─────────────────────────────────────────────
_build_zsh_prompt() {
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

    local git_str=$(_zsh_git_info)

    PROMPT="%F{$c1}┌──(%F{$c2}${glyph} ZOTHOS:${mode_tag} 🜄%F{$c1})─[%F{$c3}%n@%m%F{$c1}]─[%F{$c3}%~${git_str}%F{$c1}]─[%(?.%F{48}✦.%F{196}✗ %?) %F{$c2}%*%F{$c1}]"$'\n'
    PROMPT+="%F{$c1}└──>> %F{$c3}$%f "
}

precmd() {
    _build_zsh_prompt
}

# ── Launch Fastfetch Greeting on Interactive Shell Start ───────────────────
if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "${ZOTH_FASTFETCH_SHOWN:-}" ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
