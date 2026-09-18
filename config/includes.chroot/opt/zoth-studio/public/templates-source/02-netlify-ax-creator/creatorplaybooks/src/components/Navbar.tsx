import { useEffect } from 'react';
import { Sparkles, TrendingUp, Users, UserCircle, LogIn, LogOut, BookOpen, Workflow } from 'lucide-react';
import type { AuthUser } from '../lib/auth';
import type { MemberProfile } from '../lib/member-types';
import type { Tab } from '../types';
import { TabButton } from './TabButton';

const ITEMS: { id: Tab | 'members' | 'flow'; label: string; icon: React.ReactNode; tooltip: string }[] = [
  { id: 'creators', label: 'Mentors', icon: <Sparkles size={14} />, tooltip: 'Browse verified creator playbooks' },
  { id: 'flow', label: 'Flow', icon: <Workflow size={14} />, tooltip: 'Interactive creator playbook flow' },
  { id: 'dashboard', label: 'Dashboard', icon: <TrendingUp size={14} />, tooltip: 'Track consistency & XP' },
  { id: 'members', label: 'Members', icon: <Users size={14} />, tooltip: 'See leaderboard & vote' },
  { id: 'me', label: 'Me', icon: <UserCircle size={14} />, tooltip: 'Customize details & layouts' },
  { id: 'docs', label: 'Docs', icon: <BookOpen size={14} />, tooltip: 'API & developer reference' },
];

interface NavbarProps {
  tab: Tab | 'members' | 'flow';
  setTab: (t: Tab | 'members' | 'flow') => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  scrolled: boolean;
  user: AuthUser | null;
  profile: MemberProfile | null;
  login: () => void;
  logout: () => void;
}

export function Navbar({ tab, setTab, menuOpen, setMenuOpen, scrolled, user, profile, login, logout }: NavbarProps) {
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.name
      ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
      : 'ME';

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen, setMenuOpen]);

  const navigate = (id: Tab | 'members' | 'flow') => {
    setTab(id);
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {/* Desktop floating pill */}
      <nav className="nav-bar" aria-label="Primary">
        <a href="/" className="brand" title="CreatorPlaybooks home">
          <div className="brand-mark" style={{ overflow: 'hidden' }}>
            <img src="/brand_logo.png" alt="CreatorPlaybooks logo" className="origin-brand-img" />
          </div>
          <span className="brand-text">
            <span className="brand-name">CreatorPlaybooks</span>
            <span className="brand-tag">by Maya + Neal</span>
          </span>
        </a>

        <div className="nav-links">
          {ITEMS.map((item) => (
            <TabButton
              key={item.id}
              active={tab === item.id}
              onClick={() => navigate(item.id)}
              icon={item.icon}
              label={item.label}
              tooltip={item.tooltip}
            />
          ))}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <button
                className="nav-avatar"
                onClick={() => navigate('members')}
                title="Open member profile"
              >
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} />
                ) : (
                  <div className="nav-avatar-fallback">{initials}</div>
                )}
              </button>
              <button className="nav-logout" onClick={logout} title="Log out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button className="btn btn-hot btn-sm" onClick={login}>
              <LogIn size={14} /> Sign in
            </button>
          )}
        </div>
      </nav>

      {/* Mobile/tablet top bar */}
      <nav className="nav-mobile-bar" aria-label="Primary">
        <a href="/" className="brand" title="CreatorPlaybooks home">
          <div className="brand-mark" style={{ overflow: 'hidden' }}>
            <img src="/brand_logo.png" alt="CreatorPlaybooks logo" className="origin-brand-img" />
          </div>
          <span className="brand-text">
            <span className="brand-name">CreatorPlaybooks</span>
            <span className="brand-tag">by Maya + Neal</span>
          </span>
        </a>

        <div className="nav-actions">
          {user ? (
            <button
              className="nav-avatar"
              onClick={() => navigate('members')}
              title="Open member profile"
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} />
              ) : (
                <div className="nav-avatar-fallback">{initials}</div>
              )}
            </button>
          ) : (
            <button className="btn btn-hot btn-sm" onClick={login}>
              <LogIn size={14} />
              <span className="nav-login-text">Sign in</span>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile FAB hamburger */}
      <button
        className={`nav-fab ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span className="nav-fab-line" />
        <span className="nav-fab-line" />
        <span className="nav-fab-line" />
      </button>

      {/* Mobile bottom sheet */}
      <div className={`nav-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
      <div className={`nav-sheet ${menuOpen ? 'open' : ''}`} role="dialog" aria-label="Navigation menu">
        <div className="nav-sheet-handle" aria-hidden="true" />
        <div className="nav-sheet-links">
          {ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-sheet-link ${tab === item.id ? 'active' : ''}`}
              onClick={() => navigate(item.id)}
            >
              <span className="nav-sheet-icon">{item.icon}</span>
              <span className="nav-sheet-label">{item.label}</span>
              {tab === item.id && <span className="nav-sheet-dot" aria-hidden="true" />}
            </button>
          ))}
        </div>
        <div className="nav-sheet-divider" />
        <div className="nav-sheet-footer">
          {user ? (
            <button className="nav-sheet-footer-btn danger" onClick={logout}>
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          ) : (
            <button className="nav-sheet-footer-btn primary" onClick={login}>
              <LogIn size={18} />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
