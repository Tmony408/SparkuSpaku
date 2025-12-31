import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.middleware';
import { requestCoupleLink, acceptCoupleLink, unlinkCouple, relinkCouple, coupleHistory } from './couple.controller';

export const coupleRoutes = Router();

coupleRoutes.use(requireAuth);

coupleRoutes.post('/request', requestCoupleLink);
coupleRoutes.post('/accept', acceptCoupleLink);
coupleRoutes.post('/unlink', unlinkCouple);
coupleRoutes.post('/relink', relinkCouple);
coupleRoutes.get('/history', coupleHistory);
