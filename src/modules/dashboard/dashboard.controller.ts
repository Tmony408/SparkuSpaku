import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { AuthedRequest } from '../../middlewares/auth.middleware';
import { getMyDashboard } from './dashboard.service';

export const myDashboard = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = await getMyDashboard(req.userId!);
  res.json(ok(data));
});
