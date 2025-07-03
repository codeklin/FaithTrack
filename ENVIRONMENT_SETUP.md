# Environment Setup Guide

## ⚠️ Security Warning

**NEVER commit actual Firebase service account credentials or API keys to git!**

This repository uses environment variables to store sensitive configuration. Follow this guide to set up your environment securely.

## Environment Files

- `.env.example` - Template showing required environment variables (safe to commit)
- `.env` - Your actual environment variables (DO NOT COMMIT - already in .gitignore)
- `.env.local` - Local development overrides (DO NOT COMMIT - already in .gitignore)
- `.env.production` - Production environment variables (DO NOT COMMIT - already in .gitignore)

## Setup Instructions

### 1. Copy the example file
```bash
cp .env.example .env
```

### 2. Get your Firebase configuration

#### Client-side config (for web app):
1. Go to Firebase Console → Project Settings → General
2. Scroll down to "Your apps" section
3. Click on your web app or create one
4. Copy the config values to your `.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

#### Server-side config (for admin operations):
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the ENTIRE JSON content (as a single line) to `FIREBASE_SERVICE_ACCOUNT_KEY` in your `.env` file

### 3. Set other variables
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `NODE_ENV` - Set to `development` for local development

## Production Deployment

For production deployments:
1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Never include the actual `.env` file in your deployment
3. Use your platform's environment variable settings to configure:
   - All `VITE_*` variables for the client
   - `FIREBASE_SERVICE_ACCOUNT_KEY` for server operations
   - `FIREBASE_PROJECT_ID` for server operations

## Troubleshooting

### Git push blocked by secret detection
If you accidentally commit secrets:
1. Remove the secrets from your `.env` file
2. Amend the commit: `git commit --amend -m "your message"`
3. Force push: `git push --force-with-lease`

### Environment variables not loading
1. Make sure your `.env` file is in the project root
2. Restart your development server
3. Check that variable names match exactly (case-sensitive)
4. For Vite variables, ensure they start with `VITE_`
