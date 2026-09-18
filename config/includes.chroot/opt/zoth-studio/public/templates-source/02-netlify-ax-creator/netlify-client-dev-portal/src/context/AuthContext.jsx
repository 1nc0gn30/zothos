import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------------
  // Load profile (authenticated only)
  // -------------------------
  const loadProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', userId)
      .single();

    if (error) {
      setError(error.message);
      return null;
    }

    setProfile(data);
    return data;
  }, []);

  // -------------------------
  // Init + auth listener
  // -------------------------
  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSession(data.session);

      if (data.session?.user) {
        await loadProfile(data.session.user.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [loadProfile]);

  // -------------------------
  // Auth actions
  // -------------------------
  const signIn = useCallback(async (email, password) => {
    setError(null);
    const result = await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
    }

    return result;
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const result = await supabase.auth.signOut();

    if (result.error) {
      setError(result.error.message);
    }

    return result;
  }, []);

  // -------------------------
  // Sign up (NO profile insert)
  // -------------------------
  const signUp = useCallback(async (email, password, role, fullName) => {
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      throw error;
    }

    // Profile is created by DB trigger
    // Do NOT touch profiles here

    return data;
  }, []);

  // -------------------------
  // Context value
  // -------------------------
  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role:
        profile?.role ??
        session?.user?.user_metadata?.role ??
        null,
      loading,
      error,
      signIn,
      signUp,
      signOut,
      refreshProfile: () =>
        session?.user ? loadProfile(session.user.id) : null,
    }),
    [session, profile, loading, error, signIn, signUp, signOut, loadProfile],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return ctx;
}
