'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signUp: (email: string, password: string, name: string, countryId: number) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data && !error) {
          setUser(data as UserProfile);
        }
      }
      
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data && !error) {
          setUser(data as UserProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const response = await supabase.auth.signInWithPassword({ email, password });
    
    if (response.data.session) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', response.data.user?.id)
        .single();
      
      if (data && !error) {
        setUser(data as UserProfile);
      }
    }
    
    setLoading(false);
    return response;
  };

  const signUp = async (email: string, password: string, name: string, countryId: number) => {
    setLoading(true);
    
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          country_id: countryId
        }
      }
    });
    
    if (response.data.user) {
      // Create user profile in users table
      const { error } = await supabase.from('users').insert({
        id: response.data.user.id,
        email,
        name,
        country_id: countryId,
        role: 'user',
        is_active: true,
        created_at: new Date().toISOString()
      });
      
      if (!error) {
        // Fetch the country code for redirection
        const { data: countryData } = await supabase
          .from('countries')
          .select('code')
          .eq('id', countryId)
          .single();
        
        if (countryData) {
          // We'll handle redirection in the signup component
          console.log(`User should be redirected to /${countryData.code.toLowerCase()}`);
        }
      }
    }
    
    setLoading(false);
    return response;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
