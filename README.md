# Outreach Clone - B2B SaaS Sales Automation Platform

A modern sales automation platform built with React, Node.js, PostgreSQL, and Redis. This MVP helps sales teams automate email outreach and manage their pipeline effectively.

## Features

- **User Authentication & Workspace Management**: Secure JWT-based authentication with role-based access control
- **CRM Functionality**: Manage contacts and accounts
- **Email Sequence Automation**: Create multi-step email campaigns
- **Email Integration**: Gmail and Outlook integration for sending emails
- **Email Tracking**: Track opens, clicks, and replies
- **Task Management**: Organize and prioritize sales activities
- **Analytics Dashboard**: Monitor campaign performance and team metrics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- Zustand for state management

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL for data persistence
- Redis for caching and job queues
- Bull for background job processing
- SendGrid/Mailgun for email delivery

### DevOps
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

## Project Structure

```
outreach-clone/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── workers/        # Background job workers
│   │   └── index.ts        # App entry point
│   ├── db/
│   │   ├── migrations/     # Database migrations
│   │   └── init.sql        # Initial schema
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd outreach-clone
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application with Docker**
   ```bash
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL on port 5432
   - Redis on port 6379
   - Backend API on port 3001
   - Frontend on port 3000
   - Background worker for email processing

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

### Local Development (without Docker)

1. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Set up PostgreSQL and Redis**
   - Install PostgreSQL and create a database
   - Install Redis
   - Update DATABASE_URL and REDIS_URL in .env

3. **Run migrations**
   ```bash
   cd backend
   npm run migrate
   ```

4. **Start the services**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start

   # Terminal 3 - Worker
   cd backend
   npm run worker
   ```

## Database Migrations

```bash
# Create a new migration
cd backend
npm run migrate:create <migration-name>

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```

## API Documentation

API documentation is available at http://localhost:3001/api/docs when running the backend.

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

### Production Build

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build
```

## Environment Variables

See [.env.example](.env.example) for all required environment variables.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
