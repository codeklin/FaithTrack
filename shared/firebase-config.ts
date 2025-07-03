import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-churchcare.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-churchcare",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-churchcare.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators in development
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

export default app;
