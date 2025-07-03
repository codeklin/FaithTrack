# ChurchCare Deployment Guide

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Generate a service account key for server-side operations

2. **Environment Configuration**
   - Copy `.env.production` to `.env`
   - Fill in your Firebase credentials in the `.env` file

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   - Server runs on http://localhost:5000
   - Includes hot reload for development

## Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```
   - Creates optimized client build in `dist/public/`
   - Creates server bundle in `dist/index.js`

2. **Start Production Server**
   ```bash
   npm start
   ```

## Firebase Configuration

### Client-side Environment Variables (Vite)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Server-side Environment Variables
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
NODE_ENV=production
```

## Firestore Security Rules

Deploy the security rules from `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

## Application Features

- **Authentication**: Firebase Auth with email/password
- **Database**: Firestore for member, task, and follow-up management
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works on desktop and mobile
- **Secure API**: JWT token-based authentication

## Troubleshooting

1. **Environment Variables Not Loading**
   - Ensure `.env` file is in the root directory
   - Check that `dotenv` package is installed
   - Verify environment variable names match exactly

2. **Firebase Connection Issues**
   - Verify Firebase project ID is correct
   - Check service account key JSON format
   - Ensure Firestore and Authentication are enabled

3. **Build Errors**
   - Run `npm run check` to verify TypeScript compilation
   - Check for missing dependencies with `npm install`

## Security Considerations

- Never commit `.env` files to version control
- Use environment-specific Firebase projects (dev/staging/prod)
- Regularly rotate service account keys
- Monitor Firebase usage and security rules
