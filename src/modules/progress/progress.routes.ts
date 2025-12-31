import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { answer, list } from './progress.controller';

export const progressRoutes = Router();

progressRoutes.use(requireAuth);
progressRoutes.get('/', list);
progressRoutes.post('/answer', answer);
