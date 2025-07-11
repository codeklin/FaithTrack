import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  let serviceAccount = undefined;

  // Only try to parse if we have a valid service account key (not placeholder)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY !== 'your_service_account_json_here' &&
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY.startsWith('{')) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // For development without credentials, use project ID only
    console.warn(
      'Firebase Admin SDK: Initializing without explicit service account credentials. ' +
      'Using projectId only. This requires Application Default Credentials to be configured ' +
      'for Firestore access in this environment, or use of Firebase emulators.'
    );
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'demo-churchcare',
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export default admin;
