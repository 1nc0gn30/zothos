import React, { useState, useEffect, useRef } from 'react';
import { audioSynth } from '../utils/audioSynth';
import { executeCliCommand } from '../utils/offlineEngine';

const COMMAND_SUGGESTIONS = [
  'help',
  'help --recon',
  'help --exploit',
  'help --neural',
  'scan target.io -m deep',
  'scan 192.168.1.100 -m stealth -p 22,80,443',
  'exploit CVE-2024-6387 -t 198.51.100.92',
  'neural-net --weights --benchmark',
  'agent-status',
  'matrix --speed 1.5 --density 40',
  'synth beep',
  'synth chord',
  'synth radar',
  'theme red',
  'theme green',
  'theme amber',
  'theme purple',
  'speed instant',
  'speed fast',
  'speed normal',
  'audio on',
  'audio off',
  'crt on',
  'crt off',
  'clear',
  'export json',
  'export txt'
];

const CommandTerminal = ({
  onExecuteCommand,
  onClear,
  themeColor = '#ff0033',
  promptPrefix = 'hexstrike@nullai:~#',
  typingSpeed = 'fast'
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('hexstrike_cli_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('hexstrike_cli_history', JSON.stringify(history.slice(-50)));
    } catch {}
  }, [history]);

  const handleKeyDown = (e) => {
    audioSynth.playKeyClick();

    // Arrow Up: Previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
      setHistoryIdx(nextIdx);
      setInputVal(history[history.length - 1 - nextIdx] || '');
      return;
    }

    // Arrow Down: Next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || '');
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
      return;
    }

    // Tab: Autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;
      const matched = COMMAND_SUGGESTIONS.find(c => c.toLowerCase().startsWith(current));
      if (matched) {
        setInputVal(matched);
        audioSynth.playSynthTone(520, 'sine', 0.05);
      }
      return;
    }

    // Enter: Execute
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = inputVal.trim();
      if (!cmd) return;

      audioSynth.playCommandChime();
      setHistory(prev => [...prev.filter(c => c !== cmd), cmd]);
      setHistoryIdx(-1);
      setInputVal('');
      setSuggestions([]);

      if (cmd === 'clear' || cmd === 'cls') {
        if (onClear) onClear();
        return;
      }

      if (onExecuteCommand) {
        onExecuteCommand(cmd);
      }
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);

    if (val.trim()) {
      const match = COMMAND_SUGGESTIONS.filter(c =>
        c.toLowerCase().startsWith(val.trim().toLowerCase()) && c !== val
      ).slice(0, 3);
      setSuggestions(match);
    } else {
      setSuggestions([]);
    }
  };

  const applySuggestion = (sug) => {
    setInputVal(sug);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <div className="cli-terminal-input-bar">
      <div className="prompt-label" style={{ color: themeColor }}>
        {promptPrefix}
      </div>

      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. 'help', 'scan target.io', 'exploit', 'neural-net', 'synth')..."
          className="cli-raw-input"
          aria-label="HexStrike Interactive Command Input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />

        {suggestions.length > 0 && (
          <div className="cli-autocomplete-hints">
            <span className="hint-label">TAB TO COMPLETE:</span>
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                className="hint-pill"
                onClick={() => applySuggestion(sug)}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        className="cli-exec-btn"
        style={{ borderColor: themeColor, color: themeColor }}
        onClick={() => {
          if (!inputVal.trim()) return;
          const cmd = inputVal.trim();
          audioSynth.playCommandChime();
          setHistory(prev => [...prev.filter(c => c !== cmd), cmd]);
          setInputVal('');
          setSuggestions([]);
          if (cmd === 'clear' || cmd === 'cls') {
            if (onClear) onClear();
          } else if (onExecuteCommand) {
            onExecuteCommand(cmd);
          }
        }}
      >
        EXEC [↵]
      </button>

      <style>{`
        .cli-terminal-input-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #020002;
          border-top: 1px solid rgba(255, 0, 50, 0.35);
          padding: 10px 14px;
          font-family: 'Fira Code', 'Courier New', monospace;
          position: relative;
          z-index: 10;
        }

        .prompt-label {
          font-weight: 700;
          font-size: 0.85rem;
          white-space: nowrap;
          text-shadow: 0 0 6px rgba(255, 0, 50, 0.4);
        }

        .input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .cli-raw-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.88rem;
          caret-color: ${themeColor};
        }

        .cli-raw-input::placeholder {
          color: #555555;
          font-size: 0.8rem;
        }

        .cli-autocomplete-hints {
          position: absolute;
          bottom: 100%;
          left: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(10, 0, 5, 0.95);
          border: 1px solid rgba(255, 0, 50, 0.3);
          border-bottom: none;
          padding: 4px 8px;
          border-radius: 4px 4px 0 0;
          font-size: 0.65rem;
          z-index: 20;
        }

        .hint-label {
          color: #888;
          font-size: 0.6rem;
        }

        .hint-pill {
          background: rgba(255, 0, 50, 0.15);
          border: 1px solid rgba(255, 0, 50, 0.4);
          color: #ff99aa;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: inherit;
          font-size: 0.65rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .hint-pill:hover {
          background: ${themeColor};
          color: #000;
        }

        .cli-exec-btn {
          background: transparent;
          border: 1px solid;
          border-radius: 3px;
          padding: 6px 12px;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cli-exec-btn:hover {
          background: ${themeColor};
          color: #000 !important;
          box-shadow: 0 0 10px ${themeColor};
        }
      `}</style>
    </div>
  );
};

export default CommandTerminal;
