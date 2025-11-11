# Quick Start Guide

Get the Outreach Clone up and running in 5 minutes!

## Prerequisites

- **Docker Desktop** installed and running
- **Git** installed

That's it! Docker will handle everything else.

## Steps

### 1. Clone (if needed) and Navigate

```bash
cd "c:\Users\Noah\outreach clone"
```

### 2. Create Environment File

```bash
# Copy the example environment file
copy .env.example .env
```

The default values in `.env` are configured for local development, so you don't need to change anything to get started.

### 3. Start Everything with Docker

```bash
docker-compose up -d
```

This single command will:
- Pull required Docker images (first time only)
- Start PostgreSQL database
- Start Redis cache
- Start backend API server
- Start frontend React app
- Start background worker
- Create database tables automatically

**Wait ~30 seconds for all services to start up.**

### 4. Verify Everything is Running

```bash
docker-compose ps
```

You should see 5 services running:
- `outreach_db` (PostgreSQL)
- `outreach_redis` (Redis)
- `outreach_backend` (API)
- `outreach_frontend` (React app)
- `outreach_worker` (Background jobs)

### 5. Access the Application

Open your browser and go to:

**Frontend:** http://localhost:3000

**Backend API:** http://localhost:3001

**API Docs:** http://localhost:3001/api/docs

**Health Check:** http://localhost:3001/health

### 6. Create Your First Account

1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in the registration form:
   - Workspace Name (your company name)
   - Your name
   - Email
   - Password

**Note:** The authentication system is not yet fully implemented in Phase 2, so you may see placeholder functionality.

## View Logs

To see what's happening behind the scenes:

```bash
# All services
docker-compose logs -f

# Just the backend
docker-compose logs -f backend

# Just the frontend
docker-compose logs -f frontend

# Database
docker-compose logs -f postgres
```

Press `Ctrl+C` to stop viewing logs.

## Stop the Application

When you're done:

```bash
docker-compose down
```

This stops all services but keeps your data. Next time you run `docker-compose up -d`, your data will still be there.

## Reset Everything

To completely reset (delete all data):

```bash
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

**Option 1:** Stop the conflicting service
```bash
# Check what's using the port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432
```

**Option 2:** Change the ports in `docker-compose.yml`

### Services Not Starting

```bash
# Rebuild everything
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Errors

```bash
# Check database logs
docker-compose logs postgres

# Restart just the database
docker-compose restart postgres
```

### Can't Access Frontend

1. Wait a bit longer (it can take 30-60 seconds on first start)
2. Check frontend logs: `docker-compose logs frontend`
3. Make sure Docker has enough resources (Settings > Resources)

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend npm run migrate

# Rebuild after code changes
docker-compose build backend
docker-compose up -d backend

# See running containers
docker-compose ps

# Remove all data
docker-compose down -v
```

## Next Steps

Now that everything is running, you can:

1. **Explore the UI** - Navigate through the different pages
2. **Check the Database** - Connect with a PostgreSQL client:
   - Host: `localhost`
   - Port: `5432`
   - Database: `outreach_db`
   - User: `outreach`
   - Password: `outreach_dev_password`

3. **Test the API** - Use Postman or curl to test endpoints:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3001/api/docs
   ```

4. **Start Development** - Follow the [ROADMAP.md](ROADMAP.md) to implement Phase 2 (Authentication)

## Development Mode

For active development, you might want to run services individually:

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

### Worker Development

```bash
cd backend
npm run worker
```

## Database Access

### Using psql (command line)

```bash
# Connect to database
docker-compose exec postgres psql -U outreach -d outreach_db

# List tables
\dt

# Describe table
\d users

# Query
SELECT * FROM users;

# Exit
\q
```

### Using GUI Tools

Connect with tools like:
- **pgAdmin**
- **DBeaver**
- **TablePlus**
- **DataGrip**

Connection details:
- Host: `localhost`
- Port: `5432`
- Database: `outreach_db`
- Username: `outreach`
- Password: `outreach_dev_password`

## Environment Variables

Key environment variables you might want to customize:

```env
# Database
DATABASE_URL=postgresql://outreach:outreach_dev_password@postgres:5432/outreach_db

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Email service (for password reset, etc.)
SENDGRID_API_KEY=your-sendgrid-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Edit `.env` in the root directory.

## Getting Help

- Read [SETUP.md](SETUP.md) for detailed setup instructions
- Check [ROADMAP.md](ROADMAP.md) for the development plan
- Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for database structure
- See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for file organization

## What's Working Now

✅ Docker setup
✅ Database with complete schema
✅ Backend API skeleton
✅ Frontend React app
✅ Basic routing
✅ Layout and navigation
✅ Auth pages (UI only)

## What's Next (Phase 2)

The next phase is to implement the authentication system:

- [ ] User registration
- [ ] Login/logout
- [ ] JWT tokens
- [ ] Password reset
- [ ] Protected routes

See [ROADMAP.md](ROADMAP.md) for details.

---

**You're all set!** 🚀

Your Outreach Clone is running. Start coding!
