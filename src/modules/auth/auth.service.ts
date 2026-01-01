import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/errors';
import { generateOtp6, randomToken, sha256 } from '../../utils/crypto';
import { UserModel } from '../users/user.model';
import { signAccessToken, signRefreshToken } from '../../utils/jwt';
import { send } from 'process';
import { sendEmail } from '../../config/resend';
import { use } from 'passport';

export async function signupWithEmail(email: string, password: string, displayName?: string) {
  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) throw new AppError('Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 10);

  const rawToken = generateOtp6();
  const tokenHash = sha256(rawToken);
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const user = await UserModel.create({
    email: email.toLowerCase(),
    passwordHash,
    displayName: displayName || null,
    authProvider: 'email',
    isVerified: false,
    emailVerificationTokenHash: tokenHash,
    emailVerificationExpiresAt: expires
  });
const templateContext = {
  "appName": "Sparku Spaku",
  "firstName": user.displayName || "User",
  "otp": rawToken,
  "expiresInMinutes": "24 hours",
  "supportEmail": "support@sparkuspaku.com",
  "year": 2026
}

sendEmail(templateContext, user.email, "Verify your email", "email_verification");
  // In production you would email rawToken. For development we return it.
  return { userId: String(user._id), verificationToken: rawToken };
}

export async function verifyEmailToken(token: string, email: string) {
  const tokenHash = sha256(token);
  const now = new Date();

  const user = await UserModel.findOne({
    emailVerificationTokenHash: tokenHash,
    email,
    emailVerificationExpiresAt: { $gt: now }
  });

  if (!user) throw new AppError('Invalid or expired verification token', 400);

  user.isVerified = true;
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpiresAt = null;
  await user.save();

  return { userId: String(user._id), email: user.email };
}

export async function loginWithEmail(email: string, password: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) throw new AppError('Invalid credentials', 401);

  if (user.authProvider !== 'email') throw new AppError('Use Google login for this account', 400);
  if (!user.passwordHash) throw new AppError('Password not set', 400);

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new AppError('Invalid credentials', 401);

  if (!user.isVerified) throw new AppError('Please verify your email before logging in', 403);

  const accessToken = signAccessToken({ userId: String(user._id) });
  const refreshToken = signRefreshToken({ userId: String(user._id) });

  return { userId: String(user._id), email: user.email, displayName: user.displayName, accessToken, refreshToken };
}

export async function issueTokensForUser(userId: string) {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });
  return { accessToken, refreshToken };
}
