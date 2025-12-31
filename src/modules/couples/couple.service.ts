import mongoose from 'mongoose';
import { AppError } from '../../utils/errors';
import { UserModel } from '../users/user.model';
import { RelationshipModel } from './relationship.model';

function normalizePair(a: string, b: string) {
  const [x, y] = [a, b].sort();
  return { x, y };
}

export async function requestLink(requesterId: string, partnerEmail: string) {
  const requester = await UserModel.findById(requesterId);
  if (!requester) throw new AppError('User not found', 404);
  if (!requester.isVerified) throw new AppError('Verify your account before pairing', 403);

  const partner = await UserModel.findOne({ email: partnerEmail.toLowerCase() });
  if (!partner) throw new AppError('Partner not found', 404);
  if (!partner.isVerified) throw new AppError('Partner must be verified before pairing', 403);
  if (String(partner._id) === String(requester._id)) throw new AppError('You cannot pair with yourself', 400);

  if (requester.activeRelationshipId) throw new AppError('You are already linked. Unlink first.', 400);
  if (partner.activeRelationshipId) throw new AppError('Partner is already linked. They must unlink first.', 400);

  const { x, y } = normalizePair(String(requester._id), String(partner._id));

  const existingPending = await RelationshipModel.findOne({ status: 'pending', userA: x, userB: y });
  if (existingPending) return existingPending;

  const rel = await RelationshipModel.create({
    userA: x,
    userB: y,
    status: 'pending',
    requestedBy: requester._id
  });

  return rel;
}

export async function acceptLink(accepterId: string, relationshipId: string) {
  const rel = await RelationshipModel.findById(relationshipId);
  if (!rel) throw new AppError('Relationship not found', 404);

  const uid = String(accepterId);
  const isMember = uid === String(rel.userA) || uid === String(rel.userB);
  if (!isMember) throw new AppError('Not allowed', 403);
  if (rel.status !== 'pending') throw new AppError('Relationship is not pending', 400);

  const userA = await UserModel.findById(rel.userA);
  const userB = await UserModel.findById(rel.userB);
  if (!userA || !userB) throw new AppError('User(s) not found', 404);

  if (userA.activeRelationshipId || userB.activeRelationshipId) {
    throw new AppError('One or both users are already linked', 400);
  }

  rel.status = 'active';
  rel.endedAt = null;
  await rel.save();

  userA.activeRelationshipId = rel._id;
  userB.activeRelationshipId = rel._id;
  await Promise.all([userA.save(), userB.save()]);

  return rel;
}

export async function unlink(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  if (!user.activeRelationshipId) throw new AppError('You are not linked', 400);

  const rel = await RelationshipModel.findById(user.activeRelationshipId);
  if (!rel) throw new AppError('Relationship not found', 404);

  rel.status = 'ended';
  rel.endedAt = new Date();
  await rel.save();

  const userA = await UserModel.findById(rel.userA);
  const userB = await UserModel.findById(rel.userB);

  if (userA && String(userA.activeRelationshipId) === String(rel._id)) userA.activeRelationshipId = null;
  if (userB && String(userB.activeRelationshipId) === String(rel._id)) userB.activeRelationshipId = null;

  await Promise.all([userA?.save(), userB?.save()]);

  return rel;
}

export async function relink(userId: string, partnerEmail: string) {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  if (!user.isVerified) throw new AppError('Verify your account before pairing', 403);
  if (user.activeRelationshipId) throw new AppError('You are already linked. Unlink first.', 400);

  const partner = await UserModel.findOne({ email: partnerEmail.toLowerCase() });
  if (!partner) throw new AppError('Partner not found', 404);
  if (!partner.isVerified) throw new AppError('Partner must be verified', 403);
  if (partner.activeRelationshipId) throw new AppError('Partner is already linked. They must unlink first.', 400);

  const { x, y } = normalizePair(String(user._id), String(partner._id));

  const prev = await RelationshipModel.findOne({ userA: x, userB: y, status: 'ended' }).sort({ endedAt: -1, updatedAt: -1 });

  if (prev) {
    prev.status = 'active';
    prev.endedAt = null;
    await prev.save();

    user.activeRelationshipId = prev._id;
    partner.activeRelationshipId = prev._id;
    await Promise.all([user.save(), partner.save()]);

    return { relationship: prev, resumed: true };
  }

  const rel = await RelationshipModel.create({
    userA: x,
    userB: y,
    status: 'active',
    requestedBy: user._id,
    resumedFromRelationshipId: null
  });

  user.activeRelationshipId = rel._id;
  partner.activeRelationshipId = rel._id;
  await Promise.all([user.save(), partner.save()]);

  return { relationship: rel, resumed: false };
}

export async function history(userId: string) {
  return RelationshipModel.find({
    $or: [{ userA: new mongoose.Types.ObjectId(userId) }, { userB: new mongoose.Types.ObjectId(userId) }]
  }).sort({ updatedAt: -1 }).lean();
}
