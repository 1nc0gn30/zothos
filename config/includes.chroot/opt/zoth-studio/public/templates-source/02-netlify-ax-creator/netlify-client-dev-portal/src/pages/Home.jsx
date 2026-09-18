import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, Globe, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, loading, signIn, signUp, error } = useAuth();
  const [mode, setMode] = useState('login');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'client',
  });

  const redirectPath = useMemo(() => location.state?.from?.pathname, [location.state]);

  useEffect(() => {
    if (user && role) {
      const destination = redirectPath || (role === 'client' ? '/ClientDashboard' : '/DeveloperDashboard');
      navigate(destination, { replace: true });
    }
  }, [navigate, redirectPath, role, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus('');

    try {
      if (mode === 'login') {
        const { error: signInError } = await signIn(formState.email, formState.password);
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await signUp(
          formState.email,
          formState.password,
          formState.role,
          formState.fullName,
        );
        if (signUpError) throw signUpError;
        setStatus('Account created. Check your inbox to confirm your email if required.');
      }
    } catch (err) {
      setStatus(err.message || 'Unable to complete the request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      <header className="home-navbar">
        <div className="home-brand">
          <img src="https://www.netlify.com/v3/img/components/full-logo-dark.svg" alt="Netlify" />
          <span className="nav-pill">Dev & Client Portal</span>
        </div>
      </header>

      <main className="home-hero">
        <div className="hero-copy">
          <div className="badge">Unified Netlify experience</div>
          <h1>
            Ship faster with a portal built for{' '}
            <span className="gradient-text">clients & developers</span>
          </h1>
          <p className="hero-lede">
            Authenticate with Supabase to unlock dashboards tailored to your role. Clients see the web
            management suite while developers get debugging and deploy insights.
          </p>

          <div className="hero-meta" id="capabilities">
            <div>
              <Globe size={18} />
              <span>Global edge & instant deploys</span>
            </div>
            <div>
              <Sparkles size={18} />
              <span>AI suggestions built in</span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>Role-aware navigation</span>
            </div>
          </div>

          <div className="hero-actions" id="roles">
            <div className="role-card" onClick={() => setFormState((prev) => ({ ...prev, role: 'client' }))}>
              <div className="card-top">
                <Users size={20} />
                <span className="role">Client workspace</span>
              </div>
              <p>Manage sites, domains, assets, and collaborate with your build team.</p>
              <span className="cta">Prefer client access <ArrowRight size={16} /></span>
            </div>

            <div className="role-card" onClick={() => setFormState((prev) => ({ ...prev, role: 'developer' }))}>
              <div className="card-top">
                <Code2 size={20} />
                <span className="role">Developer workspace</span>
              </div>
              <p>Review deploys, debug environments, and secure your infrastructure.</p>
              <span className="cta">Prefer developer access <ArrowRight size={16} /></span>
            </div>
          </div>
        </div>

        <div className="auth-card" id="why">
          <div className="auth-toggle">
            <button
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
              type="button"
            >
              Sign in
            </button>
            <button
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
              type="button"
            >
              Create account
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Ada Lovelace"
                  value={formState.fullName}
                  onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={formState.password}
                onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>

            {mode === 'signup' && (
              <div className="auth-field">
                <label>Choose a portal</label>
                <div className="auth-role-group">
                  <button
                    type="button"
                    className={formState.role === 'client' ? 'selected' : ''}
                    onClick={() => setFormState((prev) => ({ ...prev, role: 'client' }))}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    className={formState.role === 'developer' ? 'selected' : ''}
                    onClick={() => setFormState((prev) => ({ ...prev, role: 'developer' }))}
                  >
                    Developer
                  </button>
                </div>
              </div>
            )}

            <button className="submit-btn" type="submit" disabled={submitting || loading}>
              {submitting
                ? 'Working…'
                : mode === 'login'
                  ? 'Sign in and continue'
                  : 'Create account'}
            </button>

            {(status || error) && <div className="status-message">{status || error}</div>}
          </form>

          <div className="auth-footnote">
            Your Supabase session unlocks the correct navigation automatically. You will be routed to
            {` ${formState.role}`} dashboards after signing in.
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
