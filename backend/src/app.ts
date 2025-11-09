import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { rateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import accountRoutes from './routes/account.routes';
import transactionRoutes from './routes/transaction.routes';
import goalRoutes from './routes/goal.routes';
import budgetRoutes from './routes/budget.routes';
import { setupSwagger } from './config/swagger';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin || '*',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/budgets', budgetRoutes);

// Swagger documentation
setupSwagger(app);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;


