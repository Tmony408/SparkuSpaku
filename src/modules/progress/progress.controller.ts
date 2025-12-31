import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { AuthedRequest } from '../../middlewares/auth.middleware';
import { answerSchema } from './progress.validators';
import { answerQuestion, listProgress } from './progress.service';

export const answer = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const body = answerSchema.parse(req.body);
  const item = await answerQuestion(req.userId!, body.questionId, body.answer);
  res.json(ok(item));
});

export const list = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const data = await listProgress(req.userId!);
  res.json(ok(data));
});
