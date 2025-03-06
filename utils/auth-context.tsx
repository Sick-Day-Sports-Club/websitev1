'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError, AuthTokenResponsePassword } from '@supabase/supabase-js';
import supabase from './supabase';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      
      // Get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
        
        // Check if user has admin role
        // This assumes you have a user_roles table or metadata in Supabase
        const { data, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();
        
        if (!roleError && data && data.role === 'admin') {
          setIsAdmin(true);
        }
      }
      
      setIsLoading(false);
    }

    getSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (session?.user) {
          // Check admin status when auth state changes
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          setIsAdmin(!error && data && data.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log(`Attempting to sign in with email: ${email}`);
      const response = await supabase.auth.signInWithPassword({ email, password });
      
      if (response.error) {
        console.error('Authentication error:', response.error);
      } else {
        console.log('Authentication successful, checking admin status');
        // Check if user has admin role after successful login
        if (response.data.user) {
          const { data, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', response.data.user.id)
            .single();
          
          if (roleError) {
            console.error('Error checking admin role:', roleError);
          } else {
            console.log('Role check result:', data);
            setIsAdmin(data && data.role === 'admin');
          }
        }
      }
      
      return response;
    } catch (err) {
      console.error('Unexpected error during authentication:', err);
      throw err;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 