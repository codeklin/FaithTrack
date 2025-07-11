// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';

// Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-churchcare.firebaseapp.com",
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-churchcare",
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-churchcare.appspot.com",
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
//   appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
// };

// Initialize Firebase
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
// export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// export const db = getFirestore(app);

// Emulator connections disabled - using production Firebase services
// To enable emulators for development, uncomment the code below and ensure emulators are running
/*
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Only connect to emulators in browser environment and development
  try {
    // Check if already connected to avoid multiple connections
    if (!(auth as any).config?.emulator) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  } catch (error) {
    console.log('Auth emulator already connected or not available');
  }

  try {
    // Check if already connected to avoid multiple connections
    if (!(db as any)._delegate?._databaseId?.projectId?.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } catch (error) {
    console.log('Firestore emulator already connected or not available');
  }
}
*/

// export default app;


// --- Supabase Configuration ---
const supabaseUrlFromEnv = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKeyFromEnv = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use provided credentials directly as fallbacks if env variables are not set
const supabaseUrl = supabaseUrlFromEnv || 'https://dtboqbgbmwzrvocjzoqz.supabase.co';
const supabaseAnonKey = supabaseAnonKeyFromEnv || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0Ym9xYmdibXd6cnZvY2p6b3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxODc3MDEsImV4cCI6MjA2Nzc2MzcwMX0.rrDqAuL66NLNJ-19jRvTS8nlzJ7UQJ4JDrnRPR-A_4k';

if (!supabaseUrl) {
  console.error(
    'Error: Supabase URL is not set. Please add VITE_SUPABASE_URL to your .env file or ensure it is passed correctly.'
  );
}

if (!supabaseAnonKey) {
  console.error(
    'Error: Supabase anon key is not set. Please add VITE_SUPABASE_ANON_KEY to your .env file or ensure it is passed correctly.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder for Firebase exports to minimize changes in other files initially.
// These should be eventually removed or replaced with Supabase equivalents.
// For now, we will export supabase.auth and supabase itself for db operations.
// If other files are directly using `auth` or `db` expecting Firebase instances,
// they will need to be updated.
export const auth = supabase.auth; // Supabase auth instance
export const db = supabase; // Supabase client instance (used for database operations)

// Default export can be the supabase client if needed, or null/undefined if not replacing `app` directly.
export default supabase; // Or null if `app` is not expected by other parts of the code
