import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Profile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  hasSolanaIdentity: boolean;
  solanaProviderId: string | null;
  isCheckingSolanaIdentity: boolean;
  advancedMode: boolean;
  toggleAdvancedMode: () => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  refreshUserIdentity: () => Promise<void>;
  fetchSolanaIdentity: (user: User | null) => Promise<void>;
}

function deriveWalletIdentity(profile: Profile | null) {
  const address = profile?.solana_wallet_address;
  return {
    hasSolanaIdentity: !!address,
    solanaProviderId: address ?? null,
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,
  hasSolanaIdentity: false,
  solanaProviderId: null,
  isCheckingSolanaIdentity: false,

  advancedMode: (() => {
    try { return localStorage.getItem('757gas_advanced_mode') === 'true'; } catch { return false; }
  })(),

  toggleAdvancedMode: () => set((state) => {
    const next = !state.advancedMode;
    try { localStorage.setItem('757gas_advanced_mode', String(next)); } catch {}
    return { advancedMode: next };
  }),

  setUser: (user) => set({ user }),

  setProfile: (profile) => set({
    profile,
    ...deriveWalletIdentity(profile),
  }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, hasSolanaIdentity: false, solanaProviderId: null });
  },

  fetchProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      set({ profile: data, ...deriveWalletIdentity(data) });
    } else {
      if (error?.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: null,
          wallet_balance: 0,
          strain_preferences: { indica: true, sativa: false, hybrid: true },
          updated_at: new Date().toISOString(),
          avatar_url: null,
          cashapp_tag: null,
        })
        .select('*')
        .single();

      if (createdProfile) {
        set({ profile: createdProfile, ...deriveWalletIdentity(createdProfile) });
      } else {
        console.error('Error creating profile:', createError);
      }
    }
  },

  refreshUserIdentity: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error refreshing user identity:', error);
      return;
    }
    const user = data.user ?? null;
    set({ user });
  },

  fetchSolanaIdentity: async (user: User | null) => {
    if (!user) {
      set({ hasSolanaIdentity: false, solanaProviderId: null, isCheckingSolanaIdentity: false });
      return;
    }

    set({ isCheckingSolanaIdentity: true });

    // Source of truth: the profile row
    const { data } = await supabase
      .from('profiles')
      .select('solana_wallet_address')
      .eq('id', user.id)
      .maybeSingle();

    if (data?.solana_wallet_address) {
      set({
        hasSolanaIdentity: true,
        solanaProviderId: data.solana_wallet_address,
        isCheckingSolanaIdentity: false,
      });
      return;
    }

    // Fallback: legacy auth.identities check for users linked before migration
    try {
      const { data: rpcData, error } = await supabase.rpc('current_user_solana_identity');
      if (error) throw error;

      const providerId = Array.isArray(rpcData)
        ? rpcData[0]?.provider_id
        : (rpcData as { provider_id?: string } | null)?.provider_id;

      set({
        hasSolanaIdentity: !!providerId,
        solanaProviderId: providerId ?? null,
        isCheckingSolanaIdentity: false,
      });
    } catch {
      set({
        hasSolanaIdentity: false,
        solanaProviderId: null,
        isCheckingSolanaIdentity: false,
      });
    }
  },
}));
