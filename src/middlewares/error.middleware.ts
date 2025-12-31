import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // eslint-disable-next-line no-console
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ ok: false, message: err.message, details: err.details });
  }

  return res.status(500).json({ ok: false, message: 'Internal server error' });
}
