import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { neon } from '../lib/neon';
import { Profile, UserRole, AuthSession, AuthUser, AuthChangeEvent } from '../types';

interface AuthContextType {
  session: AuthSession | null;
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isFacilityOwner: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Try multiple times with increasing delays
      for (let attempt = 1; attempt <= 3; attempt++) {
        // Explicitly select columns to avoid issues if 'profiles' is a view with broken underlying columns
        const { data: profileData, error } = await neon
          .from('profiles')
          .select('id, email, name, phone, role, country_id, language, is_active, created_at, updated_at')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.warn(`Attempt ${attempt}: Error fetching profile:`, error);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
          throw error;
        }

        if (profileData) {
          setProfile(profileData as Profile);
          return;
        }

        if (attempt < 3) {
          console.log(`Attempt ${attempt}: Profile not found, retrying...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }

      console.warn('Could not find user profile after multiple attempts');
      setProfile(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      const { data, error } = await neon.auth.getSession();
      const session = data?.session ?? null;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = neon.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await neon.auth.signOut();
    setProfile(null);
    setSession(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    isAdmin: profile?.role === UserRole.ADMIN || profile?.role === UserRole.SUPER_ADMIN,
    isFacilityOwner: profile?.role === UserRole.FACILITY_OWNER,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
