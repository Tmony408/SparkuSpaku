import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { signupSchema, loginSchema, verifyEmailSchema } from './auth.validators';
import { signupWithEmail, loginWithEmail, verifyEmailToken, issueTokensForUser } from './auth.service';
import { env } from '../../config/env';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const body = signupSchema.parse(req.body);
  const result = await signupWithEmail(body.email, body.password, body.displayName);
  res.status(201).json(ok({ message: 'Signup successful. Verify your email to continue.', ...result }));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const body = verifyEmailSchema.parse(req.body);
  const result = await verifyEmailToken(body.token, body.email);
  res.json(ok({ message: 'Email verified', ...result }));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  const result = await loginWithEmail(body.email, body.password);
  res.json(ok(result));
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const rawId = (req.user as any)?._id;
  const userId = rawId ? rawId.toString() : '';
  if (!userId) {
    res.status(401).json({ ok: false, message: 'Google auth failed' });
    return;
  }

  const tokens = await issueTokensForUser(userId);

  const url = new URL(env.clientBaseUrl);
  url.pathname = '/auth/callback';
  url.searchParams.set('accessToken', tokens.accessToken);
  url.searchParams.set('refreshToken', tokens.refreshToken);

  res.redirect(url.toString());
});
