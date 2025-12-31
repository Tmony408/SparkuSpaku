import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { myDashboard } from './dashboard.controller';

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);
dashboardRoutes.get('/me', myDashboard);
