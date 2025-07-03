# ChurchCare - Church Member Care System

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
- **Drizzle ORM** for database operations
- **Neon Database** (PostgreSQL) for data storage
- **Passport.js** for authentication
- **Express Session** for session management

### Development Tools
- **TSX** for TypeScript execution
- **Drizzle Kit** for database migrations
- **ESBuild** for production builds
- **PostCSS** with Autoprefixer

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL database** (Neon Database recommended)

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

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
NODE_ENV=development
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push
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

## 🗄 Database Schema

### Members Table
- Personal information (name, email, phone, address)
- Conversion and baptism tracking
- Bible study and small group participation
- Staff assignment and notes
- Status progression (new → contacted → baptized → active)

### Tasks Table
- Task management with priorities and due dates
- Member association and staff assignment
- Completion tracking and reminder system

### Follow-ups Table
- Scheduled follow-up activities
- Multiple contact methods (call, visit, email, text)
- Next follow-up scheduling and completion tracking

### Users Table
- Staff authentication and authorization
- Username/password based login system

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

The application uses Passport.js with local strategy for authentication:
- Session-based authentication
- Secure password handling
- Protected API routes
- User session management

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

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
