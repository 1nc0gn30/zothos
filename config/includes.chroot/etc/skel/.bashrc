# ~/.bashrc: executed by bash(1) for non-login shells.
# ZOTHOS - The Alchemical & Security Distro

# If not running interactively, don't do anything
case $- in
    *i*) ;;
      *) return;;
esac

# Shell History settings
HISTCONTROL=ignoreboth
shopt -s histappend
HISTSIZE=5000
HISTFILESIZE=10000

# Check window size after each command
shopt -s checkwinsize

# Colored GCC and grep
export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias ls='ls --color=auto'
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# ZOTHOS Custom Aliases & Utilities
alias zoth='zoth-ai'
alias ghost='zoth-ghost'
alias undercover='zoth-undercover'
alias win11='zoth-mode incognito'
alias matrix='zoth-mode matrix'
alias rain='zoth-matrix-rain'
alias sec='zoth-sec'
alias fetch='zoth-fastfetch'
alias panic='zoth-quicklock'

# PATH additions
export PATH="/usr/local/bin:/opt/zothos-ai-env/bin:$HOME/.local/bin:$PATH"

# ZOTH-VOID Prompt (Emerald & Obsidian styling)
PS1='\[\e[1;30m\][\[\e[1;32m\]ZOTH-VOID\[\e[1;30m\]] \[\e[1;32m\]\u@\h\[\e[0m\]:\[\e[1;36m\]\w\[\e[0m\]\$ '

# Run ZOTH fastfetch on interactive terminal launch
if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "$ZOTH_FASTFETCH_SHOWN" ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
