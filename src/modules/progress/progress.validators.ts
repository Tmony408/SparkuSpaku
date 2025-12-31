import { z } from 'zod'; export const answerSchema = z.object({ questionId: z.string().min(10), answer: z.string().min(1).max(2000) });
