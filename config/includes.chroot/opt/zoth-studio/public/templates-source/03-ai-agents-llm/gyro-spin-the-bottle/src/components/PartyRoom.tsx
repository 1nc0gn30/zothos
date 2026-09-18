import React, { useState } from 'react';
import { UserPlus, Trash2, Sparkles, RefreshCw, CheckCircle2, Flame } from 'lucide-react';
import { PromptCategory } from '../utils/prompts';

interface PartyRoomProps {
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (index: number) => void;
  selectedCategory: PromptCategory;
  onSelectCategory: (cat: PromptCategory) => void;
  activePrompt: string | null;
  selectedPlayerName: string | null;
  isGeneratingPrompt: boolean;
  onRegeneratePrompt: () => void;
  onCompleteChallenge: () => void;
}

export const PartyRoom: React.FC<PartyRoomProps> = ({
  players,
  onAddPlayer,
  onRemovePlayer,
  selectedCategory,
  onSelectCategory,
  activePrompt,
  selectedPlayerName,
  isGeneratingPrompt,
  onRegeneratePrompt,
  onCompleteChallenge,
}) => {
  const [newPlayerInput, setNewPlayerInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerInput.trim()) return;
    onAddPlayer(newPlayerInput.trim());
    setNewPlayerInput('');
  };

  const categories: { id: PromptCategory; label: string; icon: string }[] = [
    { id: 'truth', label: 'Truth', icon: '❓' },
    { id: 'dare', label: 'Dare', icon: '🔥' },
    { id: 'deep', label: 'Deep', icon: '🧠' },
    { id: 'wild', label: 'Wild Party', icon: '🎉' },
    { id: 'ai', label: 'AI Dynamic', icon: '✨' },
  ];

  return (
    <section className="party-room-panel" aria-label="Party Room Controls" role="region">
      {/* Category Selection Bar */}
      <div className="party-categories" role="radiogroup" aria-label="Prompt Category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="radio"
            aria-checked={selectedCategory === cat.id}
            className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Active Challenge Card */}
      {activePrompt && (
        <div className="active-prompt-card" role="alert" aria-live="polite">
          <div className="card-header">
            <span className="party-badge">
              <Flame className="inline-icon" /> Challenge Target: <strong>{selectedPlayerName || 'Chosen Player'}</strong>
            </span>
            <span className="cat-tag">{selectedCategory.toUpperCase()}</span>
          </div>

          <p className="prompt-text">
            {isGeneratingPrompt ? 'Generating fresh challenge...' : `"${activePrompt}"`}
          </p>

          <div className="prompt-actions">
            <button
              type="button"
              className="action-btn secondary"
              onClick={onRegeneratePrompt}
              disabled={isGeneratingPrompt}
            >
              <RefreshCw className={isGeneratingPrompt ? 'icon spinning' : 'icon'} />
              Swap Challenge
            </button>
            <button type="button" className="action-btn primary" onClick={onCompleteChallenge}>
              <CheckCircle2 className="icon" />
              Complete Challenge
            </button>
          </div>
        </div>
      )}

      {/* Player Roster Section */}
      <div className="player-roster-box">
        <div className="roster-header">
          <h3 className="roster-title">
            <Sparkles className="icon-gold" /> Active Players ({players.length})
          </h3>
          <span className="roster-hint">Positions align around the 3D bottle wheel</span>
        </div>

        <form onSubmit={handleAdd} className="add-player-form">
          <input
            type="text"
            className="player-input"
            placeholder="Add player name..."
            value={newPlayerInput}
            onChange={(e) => setNewPlayerInput(e.target.value)}
            maxLength={18}
            aria-label="New player name"
          />
          <button type="submit" className="add-player-btn" aria-label="Add player to roster">
            <UserPlus className="icon" /> Add
          </button>
        </form>

        <div className="player-chip-list">
          {players.map((name, idx) => (
            <div key={`${name}-${idx}`} className="player-chip">
              <span className="chip-num">{idx + 1}</span>
              <span className="chip-name">{name}</span>
              {players.length > 2 && (
                <button
                  type="button"
                  className="remove-chip-btn"
                  onClick={() => onRemovePlayer(idx)}
                  title={`Remove ${name}`}
                  aria-label={`Remove ${name} from game`}
                >
                  <Trash2 className="icon-sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
