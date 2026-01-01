import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import passport from 'passport';

import { authRoutes } from './modules/auth/auth.routes';
import { coupleRoutes } from './modules/couples/couple.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { questionRoutes } from './modules/questions/question.routes';
import { progressRoutes } from './modules/progress/progress.routes';

import { errorMiddleware, notFound } from './middlewares/error.middleware';
import { env } from './config/env';
import { configurePassport } from './config/passport';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(morgan('dev'));

  app.use(
    cookieSession({
      name: 'session',
      secret: env.sessionSecret,
      httpOnly: true,
      secure: env.nodeEnv === 'production'
    })
  );

  configurePassport();
  app.use(passport.initialize());

  app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, name: "Couples Game API" });
});

  app.get('/health', (_req, res) => res.json({ ok: true }));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/couples', coupleRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/questions', questionRoutes);
  app.use('/api/v1/progress', progressRoutes);


// Not Found error Handler
app.use(notFound); 

  app.use(errorMiddleware);

  return app;
}
