import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { appRouter } from '@/api/wizard/router';
import errorHandler from '@/common/middleware/errorHandler';
import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';

import { env } from '@/common/utils/envConfig';
import cors from 'cors';
import express, { type Express } from 'express';
import { getLogger } from './common/logger';

const logger = getLogger('server.start');
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(rateLimiter);

// Request logging
if (env.NODE_ENV === 'production') {
  app.use(requestLogger);
}

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/api', appRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
