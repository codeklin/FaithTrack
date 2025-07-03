import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  } else {
    // For development without credentials, use demo project
    console.log('⚠️  Firebase Admin SDK running in demo mode. Set FIREBASE_SERVICE_ACCOUNT_KEY for production.');
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'demo-churchcare',
    });
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export default admin;
