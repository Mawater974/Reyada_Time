'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { type AuthError } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';
import { useLanguage } from './LanguageContext';

// Define UserProfile type locally to avoid dependency on external types
export type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'facility_owner' | 'admin' | 'super_admin';
  country_id: number;
  language: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  created_at?: string;
  updated_at?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signUp: (email: string, password: string, firstName: string, lastName: string, countryId: number, phoneNumber: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      // Try multiple times with increasing delays
      for (let attempt = 1; attempt <= 3; attempt++) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors

        if (error) {
          console.warn(`Attempt ${attempt}: Error fetching profile:`, error);
          if (attempt < 3) {
            // Wait longer between each attempt
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
          throw error;
        }

        if (profileData) {
          setUser(profileData as UserProfile);
          setLoading(false);
          return;
        }

        if (attempt < 3) {
          console.log(`Attempt ${attempt}: Profile not found, retrying...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
      }

      // If we get here, we couldn't find the profile after all attempts
      console.warn('Could not find user profile after multiple attempts');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return {
        data: null,
        error: error as any,
      };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, countryId: number, phoneNumber: string) => {
    setLoading(true);
    try {
      // Get country code first
      const { data: countryData, error: countryError } = await supabase
        .from('countries')
        .select('code')
        .eq('id', countryId)
        .single();

      if (countryError) {
        console.error('Error fetching country:', countryError);
        throw new Error('Invalid country selected');
      }

      // Create the user with profile metadata
      const { data: authResponse, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            country_id: countryId,
          },
        },
      });

      if (authError) throw authError;

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authResponse.user?.id,
          email,
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`,
          phone: phoneNumber,
          country_id: countryId,
          role: 'user',
          language: 'en',
          is_active: true,
          email_verified: false,
          phone_verified: false,
        })
        .select();

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
      if (!authResponse.user) throw new Error('No user data returned from signup');

      return { error: null, data: authResponse };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        data: null,
        error: error as any,
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success(t('signoutSuccess'));
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user, // user is already the profile data
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
