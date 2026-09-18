import { Lock, LogIn, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function LoginGate({ message, cta }: { message: string; cta: string }) {
  const { login } = useAuth();
  return (
    <div className="page login-gate-page">
      <div className="login-gate">
        <div className="login-gate-icon"><Lock size={32} /></div>
        <div className="login-gate-badge">
          <span className="pulse-dot" />
          Members Only
        </div>
        <h2>Unlock your growth toolkit</h2>
        <p>{message}</p>

        <div className="login-gate-perks">
          <div className="login-gate-perk">
            <div className="login-gate-perk-icon pink"><TrendingUp size={16} /></div>
            <div>
              <strong>Track your growth</strong>
              <span>Streaks, XP, consistency scores, and level progression</span>
            </div>
          </div>
          <div className="login-gate-perk">
            <div className="login-gate-perk-icon cyan"><Zap size={16} /></div>
            <div>
              <strong>Schedule content</strong>
              <span>Draft posts for the week and log what you ship</span>
            </div>
          </div>
          <div className="login-gate-perk">
            <div className="login-gate-perk-icon purple"><Users size={16} /></div>
            <div>
              <strong>Join the community</strong>
              <span>Vote on creators, submit new ones, and build your profile</span>
            </div>
          </div>
          <div className="login-gate-perk">
            <div className="login-gate-perk-icon amber"><Sparkles size={16} /></div>
            <div>
              <strong>Personalize everything</strong>
              <span>Builder profile, accessibility prefs, and live preview card</span>
            </div>
          </div>
        </div>

        <button className="btn btn-hot btn-lg" onClick={login}>
          <LogIn size={18} /> {cta}
        </button>

        <div className="login-gate-hint">
          <span className="pulse-dot" />
          Free to join - sign in with email or GitHub
        </div>
      </div>
    </div>
  );
}