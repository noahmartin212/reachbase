# Outreach Clone - Setup Guide

This guide will help you set up and run the Outreach Clone sales automation platform locally.

## Project Structure Overview

```
reachbase/
├── backend/                     # Node.js/Express API
│   ├── src/
│   │   ├── config/             # Database & Redis configuration
│   │   ├── controllers/        # Route controllers (to be implemented)
│   │   ├── middleware/         # Auth, validation, error handling
│   │   ├── models/             # Database models (to be implemented)
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic (to be implemented)
│   │   ├── utils/              # Utilities (logger, errors, encryption)
│   │   ├── workers/            # Background job processors
│   │   └── index.ts            # App entry point
│   ├── db/
│   │   ├── migrations/         # Database migrations
│   │   └── init.sql            # Initial database schema
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── auth/          # Auth components
│   │   │   └── layout/        # Layout components
│   │   ├── pages/              # Page components
│   │   │   └── auth/          # Auth pages
│   │   ├── services/           # API service layer
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── docker-compose.yml          # Docker services configuration
├── .env.example                # Environment variables template
├── .gitignore
└── README.md
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (recommended) OR
- **Node.js 18+**, **PostgreSQL 15**, and **Redis 7** (for local development)
- **npm** or **yarn**
- **Git**

## Quick Start with Docker (Recommended)

This is the easiest way to get started. Docker will handle all dependencies and services.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd reachbase
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file if needed. The default values work for local development.

### 3. Start All Services

```bash
docker-compose up -d
```

This command will:
- Start PostgreSQL database on port 5432
- Start Redis on port 6379
- Start the backend API on port 3001
- Start the frontend on port 3000
- Start the background worker for email processing
- Create the database schema automatically

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs

### 5. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### 6. Stop the Application

```bash
docker-compose down
```

To also remove volumes (database data):
```bash
docker-compose down -v
```

## Local Development (Without Docker)

If you prefer to run services locally without Docker:

### 1. Install PostgreSQL and Redis

**macOS (using Homebrew):**
```bash
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15 redis-server
sudo systemctl start postgresql
sudo systemctl start redis
```

**Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Download Redis from https://github.com/microsoftarchive/redis/releases

### 2. Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE outreach_db;
CREATE USER outreach WITH PASSWORD 'outreach_dev_password';
GRANT ALL PRIVILEGES ON DATABASE outreach_db TO outreach;
\q
```

### 3. Run Database Migrations

```bash
cd backend
psql -U outreach -d outreach_db -f db/init.sql
```

### 4. Set Up Backend

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your local database URL
# DATABASE_URL=postgresql://outreach:outreach_dev_password@localhost:5432/outreach_db

# Start backend
npm run dev

# In another terminal, start worker
npm run worker
```

### 5. Set Up Frontend

```bash
cd frontend
npm install
cp .env.example .env

# Start frontend
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## Database Schema

The database schema includes the following main tables:

- **workspaces**: Organizations/companies
- **users**: User accounts with role-based access
- **email_accounts**: Connected Gmail/Outlook accounts
- **contacts**: Contact/lead information
- **accounts**: Company/organization data (CRM)
- **sequences**: Email campaign sequences
- **sequence_steps**: Individual emails in a sequence
- **sequence_enrollments**: Contact enrollments in sequences
- **emails**: Individual emails sent
- **email_events**: Email tracking events (opens, clicks, etc.)
- **tasks**: Task management
- **activities**: Activity logs (calls, meetings, notes)
- **password_reset_tokens**: Password reset functionality

See [backend/db/init.sql](backend/db/init.sql) for the complete schema.

## Next Steps - Authentication Implementation

Now that the project structure is set up, the next phase is to implement the authentication system:

### Backend Tasks:
1. Create authentication controllers ([backend/src/controllers/auth.controller.ts](backend/src/controllers/auth.controller.ts))
2. Create user controllers ([backend/src/controllers/user.controller.ts](backend/src/controllers/user.controller.ts))
3. Create validation schemas ([backend/src/validators/auth.validator.ts](backend/src/validators/auth.validator.ts))
4. Implement email service for password reset
5. Test all authentication endpoints

### Frontend Tasks:
1. Test login/register forms
2. Implement proper error handling
3. Add loading states
4. Test authentication flow end-to-end

## Configuration

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://outreach:outreach_dev_password@postgres:5432/outreach_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
SENDGRID_API_KEY=your-sendgrid-api-key
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001
```

## Troubleshooting

### Docker Issues

**Containers not starting:**
```bash
docker-compose down
docker-compose up --build
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs postgres
```

**Port already in use:**
- Change the port mappings in [docker-compose.yml](docker-compose.yml)

### Local Development Issues

**Cannot connect to PostgreSQL:**
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -l`

**Cannot connect to Redis:**
- Verify Redis is running: `redis-cli ping`
- Should return `PONG`

**Module not found errors:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the 'build' folder with a static server
```

## Additional Resources

- [README.md](README.md) - Project overview
- [Backend API Documentation](http://localhost:3001/api/docs) - Available endpoints
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Redis Documentation: https://redis.io/documentation
- Express.js: https://expressjs.com/
- React: https://react.dev/

## Support

For issues and questions, please create an issue on GitHub.
