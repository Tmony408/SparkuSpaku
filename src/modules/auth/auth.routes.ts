import { Router } from 'express';
import passport from 'passport';
import { authLimiter } from '../../middlewares/rateLimit.middleware';
import { signup, login, verifyEmail, googleCallback } from './auth.controller';

export const authRoutes = Router();

authRoutes.post('/signup', authLimiter, signup);
authRoutes.post('/login', authLimiter, login);
authRoutes.post('/verify-email', authLimiter, verifyEmail);

authRoutes.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/v1/auth/google/failure' }),
  googleCallback
);

authRoutes.get('/google/failure', (_req, res) => {
  res.status(401).json({ ok: false, message: 'Google authentication failed' });
});
