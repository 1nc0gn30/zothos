import { useState, useRef, useEffect } from 'react';
import type { CreatorProfile } from '../types';
import { HologramCanvas } from './HologramCanvas';
import { useXProfile } from '../lib/xData';

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '236, 72, 153';
}

export function CreatorCard({ creator, active, onClick, style, onHoverChange }: { creator: CreatorProfile; active: boolean; onClick: () => void; style?: React.CSSProperties; onHoverChange?: (hovered: boolean) => void }) {
  const initials = creator.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  const [imgError, setImgError] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Live X data (lightweight - no tweets)
  const { profile: xProfile, fromFallback } = useXProfile(creator.xHandle, false);
  const liveAvatar = xProfile?.avatar || creator.avatar;
  const liveFollowers = xProfile?.followers != null ? formatFollowers(xProfile.followers) : creator.followersStr;

  // Periodic random holographic glitch scheduler
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200 + Math.random() * 200);
      
      const nextTime = 4000 + Math.random() * 8000; // 4-12 seconds
      timer = setTimeout(triggerGlitch, nextTime);
    };

    timer = setTimeout(triggerGlitch, 3000 + Math.random() * 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize coordinates (-0.5 to 0.5)
    const normX = x / rect.width - 0.5;
    const normY = y / rect.height - 0.5;
    
    // Limit rotations to max 14 degrees
    const rotateX = -normY * 14;
    const rotateY = normX * 14;
    
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    card.style.setProperty('--px', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--py', `${(y / rect.height) * 100}%`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverChange) {
      onHoverChange(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverChange) {
      onHoverChange(false);
    }
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--px', '50%');
    card.style.setProperty('--py', '50%');
  };

  return (
    <div 
      ref={cardRef}
      className={`hexagon-wrapper ${active ? 'wrapper-active' : ''}`}
      style={{
        '--card-primary': creator.theme.primary,
        '--card-primary-rgb': hexToRgb(creator.theme.primary),
        '--card-secondary': creator.theme.secondary || creator.theme.primary,
        '--card-accent': creator.theme.accent || creator.theme.primary,
        ...style
      } as React.CSSProperties}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className={`creator-card-clean ${active ? 'active' : ''} ${glitchActive ? 'hologram-glitch-active' : ''}`} 
        title={`Open ${creator.name}'s playbook`}
      >
        {/* Verified Badge in top-right corner */}
        {creator.status === 'verified' && (
          <div className="creator-card-verified-badge" title="Verified Creator Playbook">
            <svg className="verified-badge-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        )}

        {/* Holographic 3D Three.js Container */}
        <div className="hologram-banner-container">
          <div className="hologram-blueprint" />
          <div className="hologram-scanline" />
          <div className="hologram-overlay" />
          <div className="hologram-glitch-overlay" />
          {isHovered && (
            <HologramCanvas 
              creatorId={creator.id}
              primaryColor={creator.theme.primary}
              secondaryColor={creator.theme.secondary || creator.theme.primary}
              accentColor={creator.theme.accent || creator.theme.primary}
            />
          )}
        </div>

        {imgError || !liveAvatar ? (
          <div className="creator-card-clean-avatar avatar-fallback" style={{ background: `linear-gradient(135deg, var(--card-primary), var(--card-accent))` }}>
            {initials}
          </div>
        ) : (
          <img src={liveAvatar} alt={creator.name} className="creator-card-clean-avatar" loading="lazy" onError={() => setImgError(true)} />
        )}
        
        <div className="creator-card-clean-body">
          <div className="creator-card-clean-top">
            <div className="creator-card-clean-title">
              <h3 className="creator-card-clean-name">{creator.name}</h3>
              <span className="creator-card-clean-handle">{creator.handle}</span>
              {xProfile?.verified && <span style={{ fontSize: '0.65rem', color: '#1da1f2', marginLeft: '4px' }}>✓</span>}
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', marginLeft: '6px', fontWeight: 600 }}>{liveFollowers}</span>
              {fromFallback && <span title="Using cached X data" style={{ fontSize: '0.6rem', color: 'var(--warning)', marginLeft: '4px', opacity: 0.7 }}>📦</span>}
            </div>
            <a
              href={`https://x.com/${creator.handle.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="creator-card-x-link"
              onClick={(e) => e.stopPropagation()}
              title="Open on X"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
