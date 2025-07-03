import { adminDb } from './firebase-admin';
import { firestoreStorage } from './firestore-storage';

// Check for required Firebase environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_SERVICE_ACCOUNT_KEY',
  ];

  const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

// Export Firestore database instance and storage
export const db = adminDb;
export const storage = firestoreStorage;