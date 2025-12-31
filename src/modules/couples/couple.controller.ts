import { Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { AuthedRequest } from '../../middlewares/auth.middleware';
import { requestLinkSchema, acceptLinkSchema, relinkSchema } from './couple.validators';
import { requestLink, acceptLink, unlink, relink, history } from './couple.service';

export const requestCoupleLink = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const body = requestLinkSchema.parse(req.body);
  const rel = await requestLink(req.userId!, body.partnerEmail);
  res.status(201).json(ok(rel));
});

export const acceptCoupleLink = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const body = acceptLinkSchema.parse(req.body);
  const rel = await acceptLink(req.userId!, body.relationshipId);
  res.json(ok(rel));
});

export const unlinkCouple = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const rel = await unlink(req.userId!);
  res.json(ok(rel));
});

export const relinkCouple = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const body = relinkSchema.parse(req.body);
  const result = await relink(req.userId!, body.partnerEmail);
  res.json(ok(result));
});

export const coupleHistory = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const rels = await history(req.userId!);
  res.json(ok(rels));
});
