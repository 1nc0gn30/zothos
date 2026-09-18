import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Mail, Save, User as UserIcon, CircleAlert } from 'lucide-react';
import HelpTip from '../components/HelpTip';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

function getMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

type StrainPreferences = {
  indica: boolean;
  sativa: boolean;
  hybrid: boolean;
};

const defaultPreferences: StrainPreferences = {
  indica: true,
  sativa: false,
  hybrid: true,
};

// Character selection options
const AVATAR_OPTIONS = [
  { id: 'char1', name: 'Explorer', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer&backgroundColor=d48f1c' },
  { id: 'char2', name: 'Curator', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Curator&backgroundColor=d48f1c' },
  { id: 'char3', name: 'Botanist', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Botanist&backgroundColor=d48f1c' },
  { id: 'char4', name: 'Alchemist', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alchemist&backgroundColor=d48f1c' },
  { id: 'char5', name: 'Pioneer', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pioneer&backgroundColor=d48f1c' },
  { id: 'char6', name: 'Visionary', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Visionary&backgroundColor=d48f1c' },
  { id: 'char7', name: 'Artisan', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Artisan&backgroundColor=d48f1c' },
  { id: 'char8', name: 'Maverick', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maverick&backgroundColor=d48f1c' },
  { id: 'char9', name: 'Sage', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage&backgroundColor=d48f1c' },
  { id: 'char10', name: 'Nomad', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nomad&backgroundColor=d48f1c' },
  { id: 'char11', name: 'Architect', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Architect&backgroundColor=d48f1c' },
  { id: 'char12', name: 'Guardian', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guardian&backgroundColor=d48f1c' },
  { id: 'char13', name: 'Oracle', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oracle&backgroundColor=d48f1c' },
  { id: 'char14', name: 'Wanderer', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wanderer&backgroundColor=d48f1c' },
  { id: 'char15', name: 'Mystic', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mystic&backgroundColor=d48f1c' },
  { id: 'char16', name: 'Captain', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Captain&backgroundColor=d48f1c' },
  { id: 'char17', name: 'Scout', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scout&backgroundColor=d48f1c' },
  { id: 'char18', name: 'Legend', path: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Legend&backgroundColor=d48f1c' },
];

export default function ProfilePage() {
  const { profile, fetchProfile, user } = useAuthStore();
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].path);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<StrainPreferences>(defaultPreferences);

  useEffect(() => {
  if (!profile) return;

  // 1. Default to profile.username
  // 2. Fallback to user.email (stripping the domain if preferred)
  // 3. Final fallback to 'Gas member'
  const defaultName = profile.username || user?.email?.split('@')[0] || 'Gas member';
  
  setUsername(defaultName);
  setPreferences(profile.strain_preferences ?? defaultPreferences);
  setSelectedAvatar(profile.avatar_url ?? AVATAR_OPTIONS[0].path);
}, [profile, user]);

  const togglePreference = (type: keyof StrainPreferences) => {
    setPreferences((current) => ({ ...current, [type]: !current[type] }));
  };

  const selectedPreferenceCount = Object.values(preferences).filter(Boolean).length;
  const preferenceSummary =
    selectedPreferenceCount === 0
      ? 'No preference filters selected yet.'
      : `${selectedPreferenceCount} preference${selectedPreferenceCount === 1 ? '' : 's'} active`;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setNotice(null);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          strain_preferences: preferences,
          avatar_url: selectedAvatar,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      await fetchProfile(user.id);
      setNotice('Profile saved.');
      setTimeout(() => setNotice(null), 3000);
    } catch (saveError) {
      setError(getMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Loading profile</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-6xl overflow-x-hidden pb-24"
    >
      <section className="bg-zinc-950 text-white relative overflow-hidden rounded-[1.8rem] p-6 sm:p-8 shadow-xl border border-zinc-800">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid gap-6 xl:grid-cols-[1fr_0.95fr] xl:items-start">
          <div className="min-w-0">
            <div className="flex items-center gap-5">
              <div className="flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-zinc-800 bg-zinc-900 sm:h-24 sm:w-24 shadow-2xl">
                <img src={selectedAvatar} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">Profile</div>
                <h1 className="mt-1 truncate font-display text-3xl font-black tracking-tight sm:text-4xl">{username || 'Gas member'}</h1>
                <p className="text-zinc-400 mt-2 text-sm leading-relaxed">Keep your character, preferences, and account details dialed in for faster repeat ordering.</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary">{preferenceSummary}</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300">${Number(profile.wallet_balance ?? 0).toFixed(2)} balance</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 max-w-full truncate">{profile.id.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
            <article className="bg-zinc-900/80 border border-zinc-800 rounded-[1.35rem] p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Wallet</div>
              <div className="mt-2 text-2xl font-black text-white">${Number(profile.wallet_balance ?? 0).toFixed(2)}</div>
              <p className="text-zinc-400 mt-2 text-xs font-medium">Available credits for checkout.</p>
            </article>
            <article className="bg-zinc-900/50 border border-zinc-800 rounded-[1.35rem] p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Prefs</div>
              <div className="mt-2 text-2xl font-black text-white">{selectedPreferenceCount}</div>
              <p className="text-zinc-400 mt-2 text-xs font-medium">Strain filters currently active.</p>
            </article>
            <article className="bg-zinc-900/50 border border-zinc-800 rounded-[1.35rem] p-5 backdrop-blur-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Member</div>
              <div className="mt-2 truncate text-lg font-black text-white">{profile.id.slice(0, 8).toUpperCase()}</div>
              <p className="text-zinc-400 mt-2 text-xs font-medium">Account reference snapshot.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-card border border-border rounded-[1.8rem] p-6 sm:p-8 shadow-sm">
        <div className="mt-1">
          <div className="mb-4 flex items-center gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Choose your character</label>
            <HelpTip text="Select an avatar to represent you across the platform." />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap">
            {AVATAR_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedAvatar(option.path)}
                className={`relative min-w-0 rounded-[1.35rem] border-2 p-3 text-center transition-all ${
                  selectedAvatar === option.path
                    ? 'border-primary scale-[1.02] bg-primary/10 shadow-md'
                    : 'border-transparent bg-muted/50 opacity-80 hover:opacity-100 hover:bg-muted'
                }`}
              >
                <img src={option.path} alt={option.name} className="mx-auto h-20 w-20 rounded-full object-cover bg-background border-2 border-border" />
                <div className="mt-3 text-xs font-bold text-foreground">{option.name}</div>
                {selectedAvatar === option.path && (
                  <div className="absolute -top-2 -right-2 rounded-full bg-primary p-1.5 text-primary-foreground shadow-lg">
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="min-w-0 space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Username</label>
              <HelpTip text="This is the name shown in the header and account areas." />
            </div>
            <div className="relative">
              <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all"
                placeholder="gas-member"
              />
            </div>
          </div>

          <div className="min-w-0 space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={user?.email ?? ''}
                readOnly
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-muted text-muted-foreground font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="bg-muted/30 border border-border mt-8 rounded-[1.35rem] p-6">
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferences</div>
            <HelpTip text="These help highlight products that match your usual picks." />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {(['indica', 'sativa', 'hybrid'] as const).map((type) => {
              const isActive = preferences[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => togglePreference(type)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-bold capitalize transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {notice && <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl mt-6 text-sm font-bold flex items-center gap-2"><Check size={16} />{notice}</div>}
        {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mt-6 text-sm font-bold flex items-center gap-2"><CircleAlert size={16} />{error}</div>}

        <div className="mt-8 pt-6 border-t border-border">
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={saving} 
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 w-full sm:w-auto shadow-md hover:shadow-lg"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </div>
      </section>
    </motion.div>
  );
}

