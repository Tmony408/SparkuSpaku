import { AppError } from '../../utils/errors';
import { UserModel } from '../users/user.model';
import { RelationshipModel } from '../couples/relationship.model';
import { ProgressModel } from './progress.model';

export async function answerQuestion(userId: string, questionId: string, answer: string) {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw new AppError('User not found', 404);
  if (!user.activeRelationshipId) throw new AppError('You are not linked', 400);

  const relationship = await RelationshipModel.findById(user.activeRelationshipId);
  if (!relationship || relationship.status !== 'active') throw new AppError('Active relationship not found', 404);

  const isA = String(relationship.userA) === String(userId);
  const isB = String(relationship.userB) === String(userId);
  if (!isA && !isB) throw new AppError('Not allowed', 403);

  const progress = await ProgressModel.findOneAndUpdate(
    { relationshipId: relationship._id, questionId },
    { $setOnInsert: { relationshipId: relationship._id, questionId } },
    { upsert: true, new: true }
  );

  if (isA) progress.answerByUserA = answer;
  if (isB) progress.answerByUserB = answer;

  const aDone = Boolean(progress.answerByUserA);
  const bDone = Boolean(progress.answerByUserB);

  progress.status = aDone && bDone ? 'completed' : 'in_progress';

  await progress.save();
  return progress;
}

export async function listProgress(userId: string) {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw new AppError('User not found', 404);
  if (!user.activeRelationshipId) return { linked: false, items: [] };

  const items = await ProgressModel.find({ relationshipId: user.activeRelationshipId }).sort({ updatedAt: -1 }).lean();
  return { linked: true, relationshipId: String(user.activeRelationshipId), items };
}
