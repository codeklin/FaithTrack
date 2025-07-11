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
- **Supabase** for database operations and authentication
- **Supabase Client Library** for server-side operations (if applicable, or custom API)

### Development Tools
- **TSX** for TypeScript execution
- **ESBuild** for production builds
- **PostCSS** with Autoprefixer

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** (or **pnpm** as used in logs)
- **Supabase project** with a database and Authentication enabled

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ChurchCare
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
# or pnpm install if you are using pnpm
```

### 3. Supabase Setup
1. Create a Supabase project at [Supabase Dashboard](https://supabase.com/dashboard).
2. Under "Project Settings" > "API", find your Project URL and anon key.
3. (Optional) If you need server-side operations with elevated privileges, get your service_role key.
4. Set up your database schema. You might need to run migrations or use the Supabase table editor.

### 4. Environment Setup
Create a `.env` file in the root directory (or ensure your environment variables are set):
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# (Optional) For server-side operations requiring elevated privileges
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

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
│   └── firestore-schema.ts # Database schema and TypeScript types (consider renaming to db-schema.ts)
├── migrations/            # Database migration files (Supabase uses its own migration system)
└── package.json           # Project dependencies and scripts
```

## 🗄 Supabase Database Schema (Example - adjust as needed)

### Members Table (`members`)
- `id` (uuid, primary key)
- `name` (text, not null)
- `email` (text, unique)
- `phone` (text)
- `address` (text)
- `date_of_birth` (date)
- `membership_status` (enum: "active", "inactive", "pending", default: "active")
- `join_date` (date)
- `converted_date` (timestamp with time zone, default: now())
- `baptized` (boolean, default: false)
- `baptism_date` (date)
- `in_bible_study` (boolean, default: false)
- `in_small_group` (boolean, default: false)
- `notes` (text)
- `assigned_staff_id` (uuid, foreign key to users table)
- `status` (enum: "new", "contacted", "baptized", "active", default: "new")
- `avatar_url` (text)
- `created_at` (timestamp with time zone, default: now())
- `updated_at` (timestamp with time zone, default: now())

### Tasks Table (`tasks`)
- `id` (uuid, primary key)
- `title` (text, not null)
- `description` (text)
- `member_id` (uuid, foreign key to members table)
- `assigned_to_id` (uuid, foreign key to users table)
- `priority` (enum: "high", "medium", "low", default: "medium")
- `status` (enum: "pending", "completed", "overdue", default: "pending")
- `due_date` (timestamp with time zone)
- `completed_date` (timestamp with time zone)
- `reminder_sent` (boolean, default: false)
- `created_at` (timestamp with time zone, default: now())
- `updated_at` (timestamp with time zone, default: now())

### Follow-ups Table (`follow_ups`)
- `id` (uuid, primary key)
- `member_id` (uuid, foreign key to members table, not null)
- `type` (enum: "call", "visit", "email", "text")
- `notes` (text)
- `scheduled_date` (timestamp with time zone)
- `completed_date` (timestamp with time zone)
- `next_follow_up_date` (timestamp with time zone)
- `created_at` (timestamp with time zone, default: now())
- `updated_at` (timestamp with time zone, default: now())

### Users Table (Supabase Auth users, potentially a public `users` table for profiles)
- Supabase Auth handles user authentication (`auth.users` table).
- You might have a public `users` table for profile information linked by user ID:
  - `id` (uuid, primary key, matches auth.users.id)
  - `email` (text, unique)
  - `display_name` (text)
  - `role` (enum: "admin", "staff", "volunteer", default: "staff")
  - `created_at` (timestamp with time zone, default: now())
  - `updated_at` (timestamp with time zone, default: now())

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

The application will use Supabase Authentication:
- Email/password authentication (and other providers Supabase supports)
- JWT token-based authentication (handled by Supabase)
- Protected API routes (can be implemented with Supabase JWTs and server-side logic or Row Level Security)
- Automatic user session management (via Supabase client libraries)
- Secure authentication flow with Supabase

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key

# (Optional) For server-side operations requiring elevated privileges
# SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

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

### Database Migrations and Security
- Use Supabase's built-in migration tools or schema management.
- Configure Row Level Security (RLS) policies in Supabase for data access control.

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md) (This file may also need updates for Supabase).

## ✅ Production Readiness Checklist (Revised for Supabase)

- [ ] Supabase Project and Database configured
- [ ] Supabase Authentication enabled and configured
- [ ] Environment variables for Supabase properly loaded (URL, Anon Key, Service Key if used)
- [ ] TypeScript compilation errors resolved
- [ ] Production build working
- [ ] Row Level Security (RLS) policies defined and active
- [ ] Error handling implemented
- [ ] API authentication middleware/logic updated for Supabase JWTs

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
