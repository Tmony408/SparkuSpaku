import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import { QuestionModel } from './question.model';

export const listQuestions = asyncHandler(async (_req: Request, res: Response) => {
  const questions = await QuestionModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  res.json(ok(questions));
});

export const seedQuestions = asyncHandler(async (_req: Request, res: Response) => {
  const count = await QuestionModel.countDocuments();
  if (count > 0) { res.json(ok({ message: 'Questions already exist', count })); return; }

  await QuestionModel.insertMany([
    { text: 'What is one small thing I did recently that made you feel loved?', category: 'connection' },
    { text: 'What is one goal you want us to achieve together this month?', category: 'goals' },
    { text: 'What is a habit you want us to build as a couple?', category: 'habits' }
  ]);

  const newCount = await QuestionModel.countDocuments();
  res.status(201).json(ok({ message: 'Seeded questions', count: newCount }));
});
