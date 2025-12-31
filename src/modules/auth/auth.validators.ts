import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8),
  displayName: z.string().min(1).optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10),
  email: z.string().email().toLowerCase().trim(),

});
