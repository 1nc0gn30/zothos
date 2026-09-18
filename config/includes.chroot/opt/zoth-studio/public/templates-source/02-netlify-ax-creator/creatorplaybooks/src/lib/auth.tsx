import { useEffect, useState, createContext, useContext, type ReactNode, useCallback } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import type { MemberProfile } from './member-types';
import { normalize, fetchMemberMe, saveMemberMe, fetchVotes } from './member-api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  jwt: (force?: boolean) => Promise<string>;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: MemberProfile | null;
  isReady: boolean;
  login: () => void;
  logout: () => void;
  openInvite: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (patch: Partial<MemberProfile>) => Promise<void>;
  votes: Record<string, any>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isReady: false,
  login: () => {},
  logout: () => {},
  openInvite: () => {},
  refreshProfile: async () => {},
  updateProfile: async () => {},
  votes: {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [votes, setVotes] = useState<Record<string, any>>({});
  const [isReady, setIsReady] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchMemberMe();
      setProfile(data);
      const allVotes = await fetchVotes();
      setVotes(allVotes);
    } catch (err) {
      console.error('Failed to load member profile', err);
    }
  }, [user]);

  const updateProfile = useCallback(async (patch: Partial<MemberProfile>) => {
    const next = await saveMemberMe(patch);
    setProfile(next);
  }, []);

  useEffect(() => {
    netlifyIdentity.init({
      container: '#netlify-identity-modal',
      locale: 'en',
    });

    const current = netlifyIdentity.currentUser();
    if (current) {
      const u = normalize(current);
      setUser(u);
      fetchMemberMe().then(setProfile).catch(() => {});
      fetchVotes().then(setVotes).catch(() => {});
    }
    setIsReady(true);

    netlifyIdentity.on('login', (u: any) => {
      const nu = normalize(u);
      setUser(nu);
      fetchMemberMe().then(setProfile).catch(() => {});
      fetchVotes().then(setVotes).catch(() => {});
      netlifyIdentity.close();
    });
    netlifyIdentity.on('logout', () => {
      setUser(null);
      setProfile(null);
      setVotes({});
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isReady,
        login: () => netlifyIdentity.open('login'),
        logout: () => netlifyIdentity.logout(),
        openInvite: () => netlifyIdentity.open('signup'),
        refreshProfile,
        updateProfile,
        votes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { netlifyIdentity };
