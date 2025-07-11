import React, { createContext, useContext, useEffect, useState } from 'react';
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   updateProfile
// } from 'firebase/auth';
// import type { User } from 'firebase/auth';
// import { auth } from '@shared/firebase-config';

// TODO: Replace with Supabase User type
interface User {
  id: string;
  email?: string | null;
  displayName?: string | null;
  // Add other relevant Supabase user fields
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  getIdToken: () => Promise<string | null>; // This might change with Supabase (e.g., getSession)
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
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    // await signInWithEmailAndPassword(auth, email, password);
    // TODO: Implement Supabase login
    console.warn('Login function not implemented for Supabase yet.', email, password);
    await Promise.resolve(); // Placeholder
  };

  const register = async (email: string, password: string, displayName?: string) => {
    // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // if (displayName && userCredential.user) {
    //   await updateProfile(userCredential.user, { displayName });
    // }

    // // Create user document in Firestore
    // if (userCredential.user) {
    //   const idToken = await userCredential.user.getIdToken();
      
    //   try {
    //     const response = await fetch('/api/auth/register', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         uid: userCredential.user.uid,
    //         email: userCredential.user.email,
    //         displayName: displayName || userCredential.user.displayName,
    //         role: 'staff', // Default role
    //       }),
    //     });

    //     if (!response.ok) {
    //       console.error('Failed to create user document in Firestore');
    //     }
    //   } catch (error) {
    //     console.error('Error creating user document:', error);
    //   }
    // }
    // TODO: Implement Supabase register
    console.warn('Register function not implemented for Supabase yet.', email, password, displayName);
    await Promise.resolve(); // Placeholder
  };

  const logout = async () => {
    // await signOut(auth);
    // TODO: Implement Supabase logout
    console.warn('Logout function not implemented for Supabase yet.');
    await Promise.resolve(); // Placeholder
  };

  const getIdToken = async (): Promise<string | null> => {
    // if (currentUser) {
    //   try {
    //     return await currentUser.getIdToken();
    //   } catch (error) {
    //     console.error('Error getting ID token:', error);
    //     return null;
    //   }
    // }
    // TODO: Implement Supabase session/token retrieval
    console.warn('getIdToken function not implemented for Supabase yet.');
    return null;
  };

  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
    //   setCurrentUser(user);
    //   setLoading(false);
    // });

    // return unsubscribe;
    // TODO: Implement Supabase onAuthStateChanged equivalent
    setLoading(false); // Simulate loading complete
    const timer = setTimeout(() => { // Simulate async auth state check
        // For now, assume no user is logged in
        setCurrentUser(null);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
