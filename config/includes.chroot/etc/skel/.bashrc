# ~/.bashrc: executed by bash(1) for non-login shells.
# 🜂 ZOTHOS - The Alchemical & Security Distro 🜄

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

# Colored grep and ls
export GCC_COLORS='error=01;31:warning=01;35:note=01;36:caret=01;32:locus=01:quote=01'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'
alias ls='ls --color=auto'
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'

# Git branch parser for prompt
parse_git_branch() {
    git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}

# ZOTHOS Custom Aliases & Utilities
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

# PATH additions
export PATH="/usr/local/bin:/opt/zothos-ai-env/bin:$HOME/.local/bin:$PATH"

# Alchemical Hermetic Powerline Prompt
# ┌──(🜂 ZOTH-VOID 🜄)-[user@host]-[path] (git-branch)
# └─➤ $ 
PS1='\[\e[38;5;48m\]┌──(\[\e[38;5;214m\]🜂 ZOTH-VOID 🜄\[\e[38;5;48m\])-\[\[\e[38;5;51m\]\u@\h\[\e[38;5;48m\]\]-\[\[\e[38;5;222m\]\w\[\e[38;5;48m\]\]\[\e[38;5;198m\]$(parse_git_branch)\[\e[38;5;48m\]\n└──➤ \[\e[38;5;48m\]\$ \[\e[0m\]'

# Run ZOTH fastfetch on interactive terminal launch
if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "$ZOTH_FASTFETCH_SHOWN" ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
