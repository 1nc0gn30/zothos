import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Zap, MapPin, CheckCircle2, Mail, Star, Quote, CircleAlert, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';
import LottieWatermark from '../components/LottieWatermark';

const memberReviews = [
  {
    name: 'M. Carter',
    detail: 'Virginia Beach',
    quote: 'Menu is easy to scan, pickup is smooth, and the updates are clear.',
  },
  {
    name: 'J. Lee',
    detail: 'Norfolk',
    quote: 'The credit wallet makes reordering fast without losing track of spend.',
  },
  {
    name: 'A. Rivera',
    detail: 'Chesapeake',
    quote: 'Private, quick, and the product notes actually help me pick right.',
  },
];

const Home = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupSuccessEmail, setSignupSuccessEmail] = useState<string | null>(null);

  // If user is already logged in, redirect to shop
  if (user) {
    return <Navigate to="/shop" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isLogin) {
      setSignupSuccessEmail(null);
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setSignupSuccessEmail(email);
        setPassword('');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>757 Gas Shop | Premium Cannabis Pickup</title>
        <meta name="description" content="757 Gas Shop - Premium cannabis pickup service in the 757 area. Sign up now for exclusive access." />
      </Helmet>

      {/* Mobile brand navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-white/10 px-4 py-3 flex items-center gap-3 md:hidden">
        <Logo className="h-8 w-8" />
        <span className="text-lg font-extrabold tracking-tight text-white">757 GAS SHOP</span>
      </nav>

      <div className="flex flex-col-reverse md:flex-row">

      {/* Left side - Branding & Info */}
      <div className="hero-watermark-wrap flex-1 bg-zinc-950 text-white flex flex-col justify-center p-8 md:p-16 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <LottieWatermark src="/lottie/gas-leaf-orbit.json" className="lottie-watermark--hero" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-watermark-content max-w-xl mx-auto"
        >
          <div className="hidden md:flex items-center space-x-4 mb-8">
            <div className="p-3 glass-effect rounded-2xl">
              <Logo className="h-14 w-14" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">757 Gas Shop</h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            <span className="text-strong">Premium Quality.</span><br />
            <span className="text-primary">Discreet Pickup.</span>
          </h2>
          
          <p className="text-zinc-400 text-lg mb-12 max-w-md text-lead">
            The 757's premier cannabis pickup service. Join our exclusive network for top-tier products and seamless transactions.
          </p>

          <div className="grid gap-3">
            <div className="flex items-start gap-4 rounded-2xl glass-premium p-4 transition-all duration-500 hover:glow-primary-hover">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary glow-primary">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg"><span className="text-emphasis">Fast Ordering</span></h3>
                <p className="text-zinc-500 text-sm"><span className="text-highlight">Browse our live menu</span> and place orders instantly.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl glass-premium p-4 transition-all duration-500 hover:glow-primary-hover">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary glow-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Secure Meetups</h3>
                <p className="text-zinc-500 text-sm"><span className="text-highlight">Safe, coordinated pickup locations</span> throughout the 757.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl glass-premium p-4 transition-all duration-500 hover:glow-primary-hover">
              <div className="p-2.5 bg-primary/10 rounded-2xl text-primary glow-primary">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Private & Discreet</h3>
                <p className="text-zinc-500 text-sm">Your privacy is our priority. <span className="text-highlight">Secure wallet and order history.</span></p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary">Member reviews</div>
                <p className="mt-1 text-sm text-zinc-500">Compact notes from local repeat buyers.</p>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-primary">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {memberReviews.map((review) => (
                <article
                  key={review.name}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-zinc-900"
                >
                  <div className="absolute right-3 top-3 text-primary/20 transition-colors group-hover:text-primary/35">
                    <Quote className="h-6 w-6" />
                  </div>
                  <div className="flex items-start gap-3 pr-8">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-sm font-extrabold text-primary">
                      {review.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="text-sm font-extrabold text-white">{review.name}</h3>
                        <span className="text-xs font-semibold text-zinc-500">{review.detail}</span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-400">{review.quote}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background relative">
        {/* Subtle ambient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-primary/3 rounded-full blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Card */}
          <div className="card-premium rounded-[2rem] p-6 sm:p-8 border border-border/60 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {isLogin
                  ? 'Sign in to manage orders, wallet, and preferences.'
                  : 'Create your account with email. Start browsing and add credits via Cash App.'}
              </p>
            </div>


            {/* Tab toggle */}
            <div className="mb-6 p-1 rounded-xl bg-muted border border-border flex">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); setSignupSuccessEmail(null); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                  isLogin
                    ? 'bg-background text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); setSignupSuccessEmail(null); }}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                  !isLogin
                    ? 'bg-background text-foreground shadow-sm border border-border/50'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                    <CircleAlert className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success notice */}
            <AnimatePresence>
              {signupSuccessEmail && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="rounded-2xl border border-primary/25 bg-primary/10 p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">Account created</p>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          Verify your email at{' '}
                          <span className="font-semibold text-foreground">{signupSuccessEmail}</span>
                          {' '}before signing in.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign-up disclaimer */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden mb-5"
                >

                </motion.div>
              )}
            </AnimatePresence>

            {/* Email form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-premium pl-11"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-premium pl-11"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-[#b56d14] px-5 py-3.5 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  {loading && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  )}
                  {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create Account')}
                </span>
              </button>
            </form>

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
              By continuing, you agree to our{' '}
              <Link to="/terms" className="font-semibold text-primary hover:underline transition-colors">
                Terms of Service
              </Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
};

export default Home;
