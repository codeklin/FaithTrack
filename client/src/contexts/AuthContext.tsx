import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Import Supabase client
import type { User, Session } from '@supabase/supabase-js'; // Import Supabase User and Session types

// import { auth } from '@shared/firebase-config'; // Firebase auth instance, to be replaced with Supabase

interface AuthContextType {
  currentUser: User | null;
  session: Session | null; // Add session state
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  // getIdToken is specific to Firebase, Supabase uses session.access_token
  // We can provide a similar function if needed, or encourage direct session usage.
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName, // Supabase uses 'full_name' in user_metadata
        }
      }
    });

    if (error) throw error;

    // The user is signed up, but email confirmation might be pending.
    // Supabase handles user creation in its own database.
    // If you need to mirror user data to another table (e.g., a 'profiles' table),
    // you would typically do that using Supabase Functions triggered by auth events (e.g., on user creation).
    // The client-side call to '/api/auth/register' might need to be re-evaluated.
    // For now, I'm removing the direct fetch call as Supabase handles user creation.

    if (data.user) {
      // Optionally, call your backend to create a user profile if needed
      // This depends on your specific backend setup with Supabase
      console.log('User registered, calling /api/auth/register for profile creation');
      try {
        // Ensure you have the access token if your backend endpoint is protected
        const currentSession = (await supabase.auth.getSession()).data.session;
        if (!currentSession) {
          console.error('No session available after sign up to call /api/auth/register');
          // This might happen if email confirmation is required and the session isn't active yet.
          // Or if the user is signed up but not yet signed in.
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${currentSession?.access_token}`, // If your endpoint needs auth
          },
          body: JSON.stringify({
            uid: data.user.id, // Use Supabase user ID
            email: data.user.email,
            displayName: displayName || data.user.user_metadata.full_name,
            role: 'staff', // Default role
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Failed to create user document via /api/auth/register:', response.status, errorBody);
        } else {
          console.log('Successfully called /api/auth/register');
        }
      } catch (error) {
        console.error('Error calling /api/auth/register:', error);
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    session,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
