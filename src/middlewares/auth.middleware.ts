import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { verifyAccessToken } from '../utils/jwt';
import { UserModel } from '../modules/users/user.model';

export interface AuthedRequest extends Request {
  userId?: string;
}

export async function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new AppError('Missing Bearer token', 401));
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await UserModel.findById(payload.userId).lean();
    if (!user) return next(new AppError('User not found', 401));
    req.userId = String(user._id);
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}
