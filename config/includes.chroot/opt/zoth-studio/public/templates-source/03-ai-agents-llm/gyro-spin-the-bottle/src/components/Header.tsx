import React from 'react';
import { RotateCw, Volume2, VolumeX, Sparkles, Box, Info } from 'lucide-react';

interface HeaderProps {
  isSpinning: boolean;
  gameMode: 'classic' | 'party';
  onToggleGameMode: (mode: 'classic' | 'party') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  use3D: boolean;
  onToggle3D: () => void;
  onOpenFAQ: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSpinning,
  gameMode,
  onToggleGameMode,
  isMuted,
  onToggleMute,
  use3D,
  onToggle3D,
  onOpenFAQ,
}) => {
  return (
    <header className="spin-header" role="banner">
      <div className="header-top">
        <h1 className="spin-title">
          <RotateCw className={isSpinning ? 'title-icon spinning' : 'title-icon'} aria-hidden="true" />
          Gyro Spin Bottle
        </h1>

        <div className="header-actions">
          <button
            type="button"
            className={`icon-toggle-btn ${use3D ? 'active' : ''}`}
            onClick={onToggle3D}
            title={use3D ? 'Switch to 2D Mode' : 'Switch to 3D WebGL Mode'}
            aria-label={use3D ? 'Disable 3D WebGL render' : 'Enable 3D WebGL render'}
          >
            <Box className="action-icon" />
            <span className="btn-label">{use3D ? '3D' : '2D'}</span>
          </button>

          <button
            type="button"
            className={`icon-toggle-btn ${!isMuted ? 'active' : ''}`}
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Web Audio' : 'Mute Web Audio'}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeX className="action-icon muted" /> : <Volume2 className="action-icon" />}
          </button>

          <button
            type="button"
            className="icon-toggle-btn"
            onClick={onOpenFAQ}
            title="View FAQ & Guide"
            aria-label="View FAQ and user guide"
          >
            <Info className="action-icon" />
          </button>
        </div>
      </div>

      <p className="spin-subtitle">
        Mobile gyroscope physics • 3D WebGL • AI Party Room
      </p>

      {/* Mode Switcher Tabs */}
      <nav className="mode-tab-nav" aria-label="Game Modes">
        <button
          type="button"
          className={`mode-tab ${gameMode === 'classic' ? 'active' : ''}`}
          onClick={() => onToggleGameMode('classic')}
        >
          <RotateCw className="tab-icon" /> Classic Wheel
        </button>

        <button
          type="button"
          className={`mode-tab ${gameMode === 'party' ? 'active' : ''}`}
          onClick={() => onToggleGameMode('party')}
        >
          <Sparkles className="tab-icon gold" /> AI Party Room
        </button>
      </nav>
    </header>
  );
};
