import { AppError } from '../../utils/errors';
import { UserModel } from '../users/user.model';
import { RelationshipModel } from '../couples/relationship.model';
import { ProgressModel } from '../progress/progress.model';

export async function getMyDashboard(userId: string) {
  const user = await UserModel.findById(userId).lean();
  if (!user) throw new AppError('User not found', 404);

  const activeRelId = user.activeRelationshipId ? String(user.activeRelationshipId) : null;
  if (!activeRelId) return { linked: false, user };

  const relationship = await RelationshipModel.findById(activeRelId).lean();
  if (!relationship) throw new AppError('Relationship not found', 404);

  const total = await ProgressModel.countDocuments({ relationshipId: relationship._id });
  const completed = await ProgressModel.countDocuments({ relationshipId: relationship._id, status: 'completed' });

  return { linked: true, user, relationship, progressSummary: { total, completed } };
}
