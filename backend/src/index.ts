import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import contactRoutes from './routes/contact.routes';
import accountRoutes from './routes/account.routes';
import sequenceRoutes from './routes/sequence.routes';
import emailRoutes from './routes/email.routes';
import taskRoutes from './routes/task.routes';
import analyticsRoutes from './routes/analytics.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } })); // Logging

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/sequences', sequenceRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// API documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    message: 'Outreach Clone API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'POST /api/auth/refresh': 'Refresh access token',
        'POST /api/auth/forgot-password': 'Request password reset',
        'POST /api/auth/reset-password': 'Reset password with token'
      },
      users: {
        'GET /api/users/me': 'Get current user profile',
        'PUT /api/users/me': 'Update current user profile',
        'GET /api/users': 'List all users in workspace (admin)',
        'GET /api/users/:id': 'Get user by ID'
      },
      contacts: {
        'GET /api/contacts': 'List contacts',
        'POST /api/contacts': 'Create contact',
        'GET /api/contacts/:id': 'Get contact details',
        'PUT /api/contacts/:id': 'Update contact',
        'DELETE /api/contacts/:id': 'Delete contact',
        'POST /api/contacts/import': 'Bulk import contacts'
      },
      accounts: {
        'GET /api/accounts': 'List accounts',
        'POST /api/accounts': 'Create account',
        'GET /api/accounts/:id': 'Get account details',
        'PUT /api/accounts/:id': 'Update account',
        'DELETE /api/accounts/:id': 'Delete account'
      },
      sequences: {
        'GET /api/sequences': 'List sequences',
        'POST /api/sequences': 'Create sequence',
        'GET /api/sequences/:id': 'Get sequence details',
        'PUT /api/sequences/:id': 'Update sequence',
        'DELETE /api/sequences/:id': 'Delete sequence',
        'POST /api/sequences/:id/enroll': 'Enroll contacts in sequence',
        'POST /api/sequences/:id/pause': 'Pause sequence',
        'POST /api/sequences/:id/resume': 'Resume sequence'
      },
      emails: {
        'GET /api/emails': 'List emails',
        'GET /api/emails/:id': 'Get email details',
        'POST /api/emails/send': 'Send individual email',
        'GET /api/emails/:id/events': 'Get email tracking events'
      },
      tasks: {
        'GET /api/tasks': 'List tasks',
        'POST /api/tasks': 'Create task',
        'GET /api/tasks/:id': 'Get task details',
        'PUT /api/tasks/:id': 'Update task',
        'DELETE /api/tasks/:id': 'Delete task'
      },
      analytics: {
        'GET /api/analytics/dashboard': 'Get dashboard metrics',
        'GET /api/analytics/sequences': 'Get sequence performance',
        'GET /api/analytics/emails': 'Get email metrics',
        'GET /api/analytics/team': 'Get team performance'
      }
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
