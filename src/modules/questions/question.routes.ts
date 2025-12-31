import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { listQuestions, seedQuestions } from './question.controller';

export const questionRoutes = Router();

questionRoutes.use(requireAuth);
questionRoutes.get('/', listQuestions);
questionRoutes.post('/seed', seedQuestions);
