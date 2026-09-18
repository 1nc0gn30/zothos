# ~/.zshrc: executed by zsh for interactive shells.
# ZOTHOS - The Alchemical & Security Distro

export HISTFILE=~/.zsh_history
export HISTSIZE=5000
export SAVEHIST=10000
setopt appendhistory
setopt sharehistory
setopt incappendhistory

alias grep='grep --color=auto'
alias ls='ls --color=auto'
alias ll='ls -la'
alias la='ls -A'

# ZOTHOS Custom Aliases
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

PROMPT='%F{242}[%F{48}ZOTH-VOID%F{242}] %F{48}%n@%m%f:%F{51}%~%f$ '

if [[ -x /usr/local/bin/zoth-fastfetch ]] && [[ -z "$ZOTH_FASTFETCH_SHOWN" ]]; then
    export ZOTH_FASTFETCH_SHOWN=1
    /usr/local/bin/zoth-fastfetch
fi
