# FaithTraka - Church Member Care System

A comprehensive Progressive Web Application designed to help churches track and support newly converted members through their spiritual journey with automated follow-ups, task management, and progress tracking.

## 🌟 Features

### Member Management
- **Member Profiles**: Complete member information including contact details, conversion date, and spiritual milestones
- **Baptism Tracking**: Monitor baptism status and scheduling
- **Bible Study Enrollment**: Track participation in Bible study programs
- **Small Group Integration**: Manage small group participation
- **Staff Assignment**: Assign dedicated staff members to new converts

### Task & Follow-up System
- **Automated Task Creation**: Generate follow-up tasks based on member status and timeline
- **Priority Management**: Organize tasks by priority (high, medium, low)
- **Due Date Tracking**: Monitor upcoming and overdue tasks
- **Multiple Follow-up Types**: Support for calls, visits, emails, and text messages
- **Reminder System**: Automated reminders for pending tasks

### Progress Tracking
- **Member Status Monitoring**: Track progression from "new" to "active" member
- **Spiritual Milestones**: Monitor baptism, Bible study, and small group participation
- **Visual Progress Indicators**: Easy-to-read status indicators and progress tracking
- **Historical Records**: Maintain complete history of member interactions

### Reporting & Analytics
- **Member Statistics**: Overview of congregation growth and member status
- **Task Analytics**: Track completion rates and staff performance
- **Follow-up Reports**: Monitor follow-up effectiveness and scheduling

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Radix UI** for accessible component primitives
- **Wouter** for client-side routing
- **Framer Motion** for animations
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Firebase Firestore** for database operations
- **Firebase Authentication** for user authentication
- **Firebase Admin SDK** for server-side operations

### Development Tools
- **TSX** for TypeScript execution
- **ESBuild** for production builds
- **PostCSS** with Autoprefixer

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase project** with Firestore and Authentication enabled

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ChurchCare
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database and Authentication
3. Generate a service account key for server-side operations
4. Copy your Firebase configuration

### 4. Environment Setup
Create a `.env` file in the root directory:
```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (for server-side)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}

# Client-side Firebase Configuration (for Vite)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Application Configuration
NODE_ENV=development
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
ChurchCare/
├── client/                 # Frontend React application
│   ├── public/            # Static assets and PWA manifest
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Application pages/routes
│   │   └── main.tsx       # Application entry point
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   ├── db.ts              # Database connection
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and TypeScript types
├── migrations/            # Database migration files
└── package.json           # Project dependencies and scripts
```

## 🗄 Firestore Database Schema

### Members Collection
- Personal information (name, email, phone, address)
- Conversion and baptism tracking
- Bible study and small group participation
- Staff assignment and notes
- Status progression (new → contacted → baptized → active)
- Document ID serves as unique identifier

### Tasks Collection
- Task management with priorities and due dates
- Member association via document ID references
- Completion tracking and reminder system
- Firestore timestamps for due dates and completion

### Follow-ups Collection
- Scheduled follow-up activities
- Multiple contact methods (call, visit, email, text)
- Next follow-up scheduling and completion tracking
- Member association via document ID references

### Users Collection
- Staff authentication via Firebase Auth
- User profiles with roles and permissions
- Document ID matches Firebase Auth UID

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 📱 Progressive Web App

ChurchCare is built as a PWA with:
- **Offline Support**: Service worker for offline functionality
- **Mobile Responsive**: Optimized for mobile and desktop use
- **App-like Experience**: Can be installed on mobile devices
- **Push Notifications**: Support for reminder notifications

## 🔐 Authentication

The application uses Firebase Authentication:
- Email/password authentication
- JWT token-based authentication
- Protected API routes with Firebase Admin SDK
- Automatic user session management
- Secure authentication flow with Firebase Auth

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
# Firebase Configuration (same as development)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# Client-side Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

NODE_ENV=production
```

## 🚀 Production Deployment

### Build the Application
```bash
npm run build
```
This creates:
- Optimized client build in `dist/public/`
- Server bundle in `dist/index.js`

### Start Production Server
```bash
npm start
```

### Deploy Firestore Security Rules
```bash
firebase deploy --only firestore:rules
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## ✅ Production Readiness Checklist

- [x] Firebase Firestore database configured
- [x] Firebase Authentication enabled
- [x] Environment variables properly loaded
- [x] TypeScript compilation errors resolved
- [x] Production build working
- [x] Security rules defined
- [x] Error handling implemented
- [x] API authentication middleware active

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `/docs` folder
- Review the code comments for implementation details

## 🔄 Version History

- **v1.0.0** - Initial release with core member management and task tracking features

---

Built with ❤️ for church communities to better care for their members and support spiritual growth.
