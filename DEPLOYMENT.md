# ChurchCare Deployment Guide

## ⚠️ Security Warning

**NEVER commit actual Firebase service account credentials or API keys to git!** This project uses environment variables to store sensitive configuration.

## Prerequisites

1.  **Node.js**: `v18` or higher is required. It's recommended to use a version manager like nvm. This project includes a `.nvmrc` file, so you can run `nvm use` in the project root to switch to the correct version.
2.  **Firebase CLI**: Install the Firebase command-line tools: `pnpm add -g firebase-tools`.

## Environment Setup

This project uses a `.env` file for managing environment variables. A `.env.example` file is provided as a template.

1.  **Copy the example file**:
   ```bash
   cp .env.example .env
   ```
   *Note: The `.env` file is listed in `.gitignore` and should never be committed to version control.*

2.  **Get Firebase Client-side Config**:
    1.  Go to Firebase Console → Project Settings → General.
    2.  Scroll down to "Your apps" and select your web app.
    3.  Under "Firebase SDK snippet", select "Config" and copy the values into your `.env` file. They are prefixed with `VITE_`.

3.  **Get Firebase Server-side Config**:
    1.  Go to Firebase Console → Project Settings → Service Accounts.
    2.  Click "Generate new private key" and download the JSON file.
    3.  **Important**: To avoid issues with special characters in the JSON key, it's best to store it as a Base64 string.
        -   On macOS/Linux: `cat /path/to/your-service-account.json | base64`
        -   On Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\to\your-service-account.json"))`
    4.  Copy the resulting Base64 string into `FIREBASE_SERVICE_ACCOUNT_KEY_BASE64` in your `.env` file.

4.  **Set Other Variables**:
    -   `FIREBASE_PROJECT_ID`: Your Firebase project ID.
    -   `NODE_ENV`: Set to `development` for local work.

## Development

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Start Development Server**:
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:5000` with hot-reloading enabled.

## Firebase Project Configuration

If you are setting up a new Firebase project, ensure the following are configured:

-   **Authentication**: Enable the "Email/Password" sign-in provider.
-   **Firestore**: Create a Firestore database in your project.
-   **Security Rules**: Deploy the security rules from the project root:
    ```bash
    firebase deploy --only firestore:rules
    ```

## Production Deployment

1.  **Set Production Environment**:
    -   For hosting platforms like Vercel, Netlify, or Heroku, set the environment variables in the platform's dashboard. Do not include the `.env` file in your deployment.
    -   Remember to set `NODE_ENV=production`.

2.  **Build the Application**:
    ```bash
    pnpm build
    ```
    This creates an optimized client build in `dist/public/` and a server bundle at `dist/index.js`.

3.  **Start Production Server**:
    ```bash
    pnpm start
    ```

## Security Considerations

-   **Environment Variables**: Never commit `.env` files to version control. Use your hosting provider's system for production secrets.
-   **Service Account Keys**: Rotate your Firebase service account keys regularly.
-   **Firebase Security**: Regularly review and test your `firestore.rules` to ensure data is secure.
-   **Monitoring**: Monitor Firebase usage and set up billing alerts to avoid unexpected costs.

## Troubleshooting

-   **Environment Variables Not Loading**: Ensure the `.env` file is in the project root and that you've restarted the server after changes. For client-side variables, ensure they are prefixed with `VITE_`.
-   **Firebase Connection Issues**: Double-check that your Project ID and service account key are correct. Ensure the required Firebase services (Auth, Firestore) are enabled in the console.
-   **Build Errors**: Run `pnpm check` to look for TypeScript errors. Ensure all dependencies are installed with `pnpm install`.
