# FaithTrack - Church Member Care System

## Overview

FaithTrack is a modern Progressive Web App (PWA) designed for church congregation management, specifically focused on tracking and supporting newly converted members through automated follow-ups and reminders. The application provides a comprehensive platform for church staff to manage member care, track spiritual progress, and maintain effective communication with congregation members.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Driver**: Neon Database serverless driver
- **API Design**: RESTful API with JSON responses
- **Schema Validation**: Zod for runtime type checking

### Progressive Web App Features
- **Service Worker**: Custom SW for offline functionality and caching
- **Manifest**: PWA manifest with shortcuts and icons
- **Responsive Design**: Mobile-first approach with desktop sidebar
- **Offline Support**: Caches static resources and API responses

## Key Components

### Data Models
- **Members**: Core entity tracking converted members with baptism status, Bible study enrollment, and small group participation
- **Tasks**: Follow-up tasks and reminders assigned to staff members
- **Follow-ups**: Scheduled interactions (calls, visits, emails, texts) with tracking
- **Users**: Staff authentication and role management (schema defined but not fully implemented)

### Frontend Components
- **Layout System**: Responsive design with desktop sidebar and mobile navigation
- **Dashboard**: Statistics overview with recent members and urgent tasks
- **Member Management**: CRUD operations for member profiles
- **Task Management**: Follow-up scheduling and completion tracking
- **Progress Tracking**: Spiritual milestone monitoring
- **Reporting**: Data export and analytics

### Backend Services
- **Storage Layer**: Abstracted storage interface with PostgreSQL database implementation
- **API Routes**: RESTful endpoints for all CRUD operations
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **Middleware**: Request logging, error handling, and JSON parsing

## Data Flow

1. **Client Requests**: React components initiate API calls through TanStack Query
2. **API Processing**: Express routes handle requests, validate data with Zod schemas
3. **Data Access**: Storage layer abstracts database operations using PostgreSQL
4. **Response**: JSON responses with proper error handling and status codes
5. **Client Update**: Query client manages cache invalidation and UI updates

## External Dependencies

### Core Libraries
- React, TypeScript, Vite for frontend foundation
- Express.js, Drizzle ORM for backend services
- TanStack Query for advanced data fetching and caching
- Radix UI primitives for accessible component foundation

### Database & Storage
- PostgreSQL as primary database
- Neon Database serverless driver for cloud deployment
- Drizzle Kit for database migrations and schema management

### Development Tools
- ESBuild for backend bundling
- Replit integration for cloud development
- Tailwind CSS for utility-first styling

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with hot reload
- **Database**: PostgreSQL via DATABASE_URL environment variable

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: ESBuild bundles server to `dist/index.js`
- **Database**: Migrations handled via `drizzle-kit push`

### Environment Configuration
- Development and production modes with different optimizations
- Replit-specific plugins for cloud development
- Environment variables for database connections

## Changelog

- June 30, 2025: Database migration completed - Successfully migrated from in-memory storage to PostgreSQL database with proper schema, relations, and sample data seeding
- June 30, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.