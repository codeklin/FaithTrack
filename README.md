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
- **Supabase** for database operations and authentication (PostgreSQL)
- **Supabase SDK** for server-side operations

### Development Tools
- **TSX** for TypeScript execution
- **ESBuild** for production builds
- **PostCSS** with Autoprefixer

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (as per `pnpm-lock.yaml` and `vercel-build` script)
- **Supabase project** with a PostgreSQL database and Authentication enabled

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ChurchCare
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Supabase Setup
1. Create a Supabase project at [Supabase Dashboard](https://supabase.com/dashboard).
2. Under "Project Settings" > "API", find your Project URL and anon key.
3. You'll also need the Service Role Key for server-side operations (handle with care).
4. Set up your database schema. You might need to run migrations if you have existing SQL schema files (see `migrations/` directory if present).

### 4. Environment Setup
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# For Vite (client-side) - VITE_ prefix is important
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# For Server (backend)
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"

# Application Configuration
NODE_ENV=development
```

### 5. Start Development Server
```bash
pnpm run dev
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
├── shared/                # Shared types and schemas (if any, could be Supabase specific types)
│   └── schema.ts          # Example: Zod schemas for validation, or Supabase generated types
├── migrations/            # Database migration files (e.g., for Supabase CLI)
└── package.json           # Project dependencies and scripts
```

## 🗄 Supabase Database Schema (Example - adapt to your actual schema)

Supabase uses PostgreSQL. Your schema would be defined using SQL.
For example, you might have tables like:

### `members` Table
- `id` (uuid, primary key)
- `created_at` (timestamp with time zone)
- `name` (text)
- `email` (text, unique)
- `phone` (text)
- `address` (text)
- `conversion_date` (date)
- `baptism_status` (text)
- `staff_assigned_id` (uuid, foreign key to `users` table)
- ... other relevant fields

### `tasks` Table
- `id` (uuid, primary key)
- `created_at` (timestamp with time zone)
- `member_id` (uuid, foreign key to `members` table)
- `description` (text)
- `priority` (text)
- `due_date` (timestamp with time zone)
- `completed_at` (timestamp with time zone, nullable)
- ... other relevant fields

### `follow_ups` Table
- `id` (uuid, primary key)
- `member_id` (uuid, foreign key to `members` table)
- `method` (text e.g., 'call', 'visit')
- `scheduled_date` (timestamp with time zone)
- `completed_at` (timestamp with time zone, nullable)
- ... other relevant fields

### `users` Table (Supabase Auth users are in `auth.users`)
- This table might be a public `profiles` table linked to `auth.users` via user ID.
- `id` (uuid, primary key, typically references `auth.users.id`)
- `full_name` (text)
- `role` (text, e.g., 'staff', 'admin')
- ... other profile-specific fields

## 🔧 Available Scripts (using pnpm)

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm check` - TypeScript type checking
- `pnpm vercel-build` - Vercel specific build command (includes `pnpm build`)
- If using Supabase CLI for migrations:
  - `supabase link --project-ref <your-project-id>`
  - `supabase db push` (if using local changes without migration files)
  - `supabase migration new <migration_name>`
  - `supabase db reset` (for local development)

## 📱 Progressive Web App

ChurchCare is built as a PWA with:
- **Offline Support**: Service worker for offline functionality
- **Mobile Responsive**: Optimized for mobile and desktop use
- **App-like Experience**: Can be installed on mobile devices
- **Push Notifications**: Support for reminder notifications

## 🔐 Authentication

The application uses Supabase Authentication:
- Email/password authentication (can be extended with OAuth providers like Google, GitHub etc.)
- JWT token-based authentication (Supabase issues JWTs)
- Protected API routes (can be implemented using Supabase SDK on the server or by verifying JWTs)
- Automatic user session management (handled by Supabase client libraries)
- Secure authentication flow with Supabase Auth, including Row Level Security (RLS) on your database tables.

## 🚀 Deployment

### Production Build
```bash
pnpm build
# This typically runs `vite build` and esbuild for the server as defined in package.json scripts.
# The output is usually in `dist/` or `api/` based on your build script.
```

### Environment Variables for Production
Create a `.env.production` file or set environment variables in your hosting provider:
```env
# Client-side Supabase Configuration (for Vite)
VITE_SUPABASE_URL="YOUR_PRODUCTION_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_PRODUCTION_SUPABASE_ANON_KEY"

# Server-side Supabase Configuration
SUPABASE_SERVICE_ROLE_KEY="YOUR_PRODUCTION_SUPABASE_SERVICE_ROLE_KEY" # Keep this secret!

NODE_ENV=production
```

## 🚀 Production Deployment

### Build the Application
```bash
pnpm vercel-build
# Or your specific build command e.g., pnpm build
```
This creates:
- Optimized client build (e.g., in `dist/client/` or `dist/public/`)
- Server bundle (e.g., in `api/index.js` or `dist/server/`)

### Start Production Server
```bash
pnpm start
# This usually runs `node api/index.js` or your production server entry point.
```

### Supabase Database Migrations & Policies
- Apply database migrations using Supabase CLI: `supabase db push` (if you have local changes) or apply migrations from your `supabase/migrations` folder.
- Ensure Row Level Security (RLS) policies are enabled and correctly configured on your Supabase tables for data protection.

For detailed deployment instructions, refer to your hosting provider's documentation (e.g., Vercel, Netlify) and Supabase's deployment guides.

## ✅ Production Readiness Checklist (Supabase)

- [ ] Supabase project created and database schema migrated/set up.
- [ ] Supabase Authentication configured (providers, email templates).
- [ ] Row Level Security (RLS) policies enabled and tested on all relevant tables.
- [ ] Environment variables for Supabase (URL, anon key, service role key) are correctly set in production.
- [ ] TypeScript compilation errors resolved.
- [ ] Production build (`pnpm build` or `pnpm vercel-build`) working.
- [ ] Error handling implemented throughout the application.
- [ ] API authentication/authorization middleware (using Supabase session/JWT) active and tested.
- [ ] Database backups configured in Supabase (automatic for paid tiers, consider for free tier).
- [ ] Test application thoroughly in a staging or production-like environment.

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
