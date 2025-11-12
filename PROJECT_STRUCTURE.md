# Project Structure

Complete file tree for the Outreach Clone application.

## Root Directory

```
reachbase/
├── backend/                         # Backend API (Node.js + Express)
├── frontend/                        # Frontend app (React + TypeScript)
├── docker-compose.yml               # Docker services configuration
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Project overview
├── SETUP.md                         # Setup instructions
├── ROADMAP.md                       # Development roadmap
├── DATABASE_SCHEMA.md               # Database documentation
└── PROJECT_STRUCTURE.md             # This file
```

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts              # PostgreSQL configuration
│   │   └── redis.ts                 # Redis configuration
│   │
│   ├── controllers/                 # Route controllers (TO IMPLEMENT)
│   │   ├── auth.controller.ts       # Authentication endpoints
│   │   ├── user.controller.ts       # User management
│   │   ├── contact.controller.ts    # Contact CRUD
│   │   ├── account.controller.ts    # Account CRUD
│   │   ├── sequence.controller.ts   # Sequence management
│   │   ├── email.controller.ts      # Email operations
│   │   ├── task.controller.ts       # Task management
│   │   └── analytics.controller.ts  # Analytics data
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication
│   │   ├── validate.ts              # Request validation
│   │   ├── rateLimiter.ts           # Rate limiting
│   │   ├── errorHandler.ts          # Error handling
│   │   └── notFound.ts              # 404 handler
│   │
│   ├── models/                      # Database models (TO IMPLEMENT)
│   │   ├── user.model.ts
│   │   ├── contact.model.ts
│   │   ├── account.model.ts
│   │   ├── sequence.model.ts
│   │   ├── email.model.ts
│   │   └── task.model.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts           # Auth routes (skeleton)
│   │   ├── user.routes.ts           # User routes (skeleton)
│   │   ├── contact.routes.ts        # Contact routes (skeleton)
│   │   ├── account.routes.ts        # Account routes (skeleton)
│   │   ├── sequence.routes.ts       # Sequence routes (skeleton)
│   │   ├── email.routes.ts          # Email routes (skeleton)
│   │   ├── task.routes.ts           # Task routes (skeleton)
│   │   └── analytics.routes.ts      # Analytics routes (skeleton)
│   │
│   ├── services/                    # Business logic (TO IMPLEMENT)
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── contact.service.ts
│   │   ├── account.service.ts
│   │   ├── sequence.service.ts
│   │   ├── email.service.ts
│   │   ├── emailProvider.service.ts # SendGrid/Mailgun
│   │   ├── gmail.service.ts         # Gmail API
│   │   ├── outlook.service.ts       # Outlook API
│   │   ├── oauth.service.ts         # OAuth handling
│   │   ├── tracking.service.ts      # Email tracking
│   │   ├── task.service.ts
│   │   └── analytics.service.ts
│   │
│   ├── utils/
│   │   ├── logger.ts                # Winston logger
│   │   ├── errors.ts                # Custom error classes
│   │   └── encryption.ts            # Encryption utilities
│   │
│   ├── validators/                  # Joi validation schemas (TO IMPLEMENT)
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── contact.validator.ts
│   │   ├── account.validator.ts
│   │   ├── sequence.validator.ts
│   │   ├── email.validator.ts
│   │   └── task.validator.ts
│   │
│   ├── workers/
│   │   ├── index.ts                 # Worker entry point
│   │   ├── emailWorker.ts           # Email sending worker (TO IMPLEMENT)
│   │   └── sequenceWorker.ts        # Sequence processing (TO IMPLEMENT)
│   │
│   └── index.ts                     # Express app entry point
│
├── db/
│   ├── migrations/                  # Database migrations (TO IMPLEMENT)
│   └── init.sql                     # Initial database schema
│
├── logs/                            # Application logs (auto-generated)
│   ├── combined.log
│   ├── error.log
│   ├── exceptions.log
│   └── rejections.log
│
├── Dockerfile                       # Docker image definition
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── .env.example                     # Environment template
```

## Frontend Structure

```
frontend/
├── public/
│   ├── index.html                   # HTML template
│   ├── manifest.json                # PWA manifest
│   └── favicon.ico                  # Favicon (TO ADD)
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── PrivateRoute.tsx     # Route protection
│   │   │
│   │   ├── layout/
│   │   │   ├── Layout.tsx           # Main layout
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   └── Header.tsx           # Top header
│   │   │
│   │   ├── contacts/                # Contact components (TO IMPLEMENT)
│   │   │   ├── ContactList.tsx
│   │   │   ├── ContactModal.tsx
│   │   │   └── ContactImport.tsx
│   │   │
│   │   ├── accounts/                # Account components (TO IMPLEMENT)
│   │   │   ├── AccountList.tsx
│   │   │   └── AccountModal.tsx
│   │   │
│   │   ├── sequences/               # Sequence components (TO IMPLEMENT)
│   │   │   ├── SequenceList.tsx
│   │   │   ├── SequenceBuilder.tsx
│   │   │   └── StepEditor.tsx
│   │   │
│   │   ├── emails/                  # Email components (TO IMPLEMENT)
│   │   │   ├── EmailList.tsx
│   │   │   ├── EmailDetail.tsx
│   │   │   └── ComposeModal.tsx
│   │   │
│   │   ├── tasks/                   # Task components (TO IMPLEMENT)
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskModal.tsx
│   │   │
│   │   ├── analytics/               # Analytics components (TO IMPLEMENT)
│   │   │   ├── MetricCard.tsx
│   │   │   ├── LineChart.tsx
│   │   │   └── BarChart.tsx
│   │   │
│   │   └── common/                  # Shared components (TO IMPLEMENT)
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Table.tsx
│   │       ├── Pagination.tsx
│   │       ├── SearchBar.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx            # Login page
│   │   │   ├── Register.tsx         # Registration page
│   │   │   └── ForgotPassword.tsx   # Password reset
│   │   │
│   │   ├── Dashboard.tsx            # Dashboard page
│   │   ├── Contacts.tsx             # Contacts page (skeleton)
│   │   ├── Accounts.tsx             # Accounts page (skeleton)
│   │   ├── Sequences.tsx            # Sequences page (skeleton)
│   │   ├── Emails.tsx               # Emails page (skeleton)
│   │   ├── Tasks.tsx                # Tasks page (skeleton)
│   │   ├── Analytics.tsx            # Analytics page (skeleton)
│   │   └── Settings.tsx             # Settings page (skeleton)
│   │
│   ├── services/
│   │   ├── api.ts                   # Axios instance
│   │   ├── auth.service.ts          # Auth API calls
│   │   ├── contact.service.ts       # Contact API (TO IMPLEMENT)
│   │   ├── account.service.ts       # Account API (TO IMPLEMENT)
│   │   ├── sequence.service.ts      # Sequence API (TO IMPLEMENT)
│   │   ├── email.service.ts         # Email API (TO IMPLEMENT)
│   │   ├── task.service.ts          # Task API (TO IMPLEMENT)
│   │   └── analytics.service.ts     # Analytics API (TO IMPLEMENT)
│   │
│   ├── hooks/                       # Custom React hooks (TO IMPLEMENT)
│   │   ├── useAuth.ts
│   │   ├── useContacts.ts
│   │   ├── useSequences.ts
│   │   └── useDebounce.ts
│   │
│   ├── store/
│   │   ├── authStore.ts             # Auth state (Zustand)
│   │   ├── contactStore.ts          # Contact state (TO IMPLEMENT)
│   │   └── sequenceStore.ts         # Sequence state (TO IMPLEMENT)
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   │
│   ├── utils/                       # Utility functions (TO IMPLEMENT)
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   │
│   ├── App.tsx                      # App component with routing
│   ├── index.tsx                    # React entry point
│   └── index.css                    # Global styles (Tailwind)
│
├── Dockerfile                       # Docker image definition
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
└── .env.example                     # Environment template
```

## Configuration Files

### Docker
- **docker-compose.yml**: Orchestrates all services (PostgreSQL, Redis, Backend, Frontend, Worker)
- **backend/Dockerfile**: Backend container definition
- **frontend/Dockerfile**: Frontend container definition

### Environment
- **.env.example**: Template for environment variables
- **backend/.env.example**: Backend-specific variables
- **frontend/.env.example**: Frontend-specific variables

### TypeScript
- **backend/tsconfig.json**: Backend TypeScript configuration
- **frontend/tsconfig.json**: Frontend TypeScript configuration

### Package Management
- **backend/package.json**: Backend dependencies and scripts
- **frontend/package.json**: Frontend dependencies and scripts

### Styling
- **frontend/tailwind.config.js**: Tailwind CSS configuration
- **frontend/postcss.config.js**: PostCSS configuration

## Database

```
PostgreSQL Database: outreach_db
├── Tables (17 total)
│   ├── workspaces
│   ├── users
│   ├── password_reset_tokens
│   ├── email_accounts
│   ├── accounts
│   ├── contacts
│   ├── sequences
│   ├── sequence_steps
│   ├── sequence_enrollments
│   ├── emails
│   ├── email_events
│   ├── tasks
│   └── activities
│
├── Indexes (30+)
├── Triggers (automated updated_at)
└── Functions (update_updated_at_column)
```

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for detailed schema documentation.

## Key Technologies

### Backend
- **Node.js 18+**: Runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: Database
- **Redis**: Caching and queues
- **Bull**: Background job processing
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Winston**: Logging
- **Joi**: Validation
- **SendGrid/Mailgun**: Email delivery

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Routing
- **React Query**: Data fetching
- **Zustand**: State management
- **React Hook Form**: Form handling
- **Zod**: Validation
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **Heroicons**: Icons

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **ESLint**: Linting
- **Jest**: Testing

## File Count Summary

### Currently Implemented
- **Backend files**: ~25 files
- **Frontend files**: ~20 files
- **Configuration files**: ~12 files
- **Documentation files**: 5 files
- **Total**: ~62 files

### To Be Implemented
- **Backend**: ~25 additional files
- **Frontend**: ~35 additional files
- **Tests**: ~40 test files
- **Total when complete**: ~162 files

## Development Workflow

1. **Start development environment**: `docker-compose up -d`
2. **View logs**: `docker-compose logs -f`
3. **Stop services**: `docker-compose down`
4. **Backend changes**: Auto-reload with nodemon
5. **Frontend changes**: Hot-reload with React Scripts
6. **Database changes**: Create migrations in `backend/db/migrations/`
7. **Run tests**: `npm test` in respective directories

## Next Steps

See [ROADMAP.md](ROADMAP.md) for the detailed development plan.

Current phase: **Phase 2 - Authentication System Implementation**
