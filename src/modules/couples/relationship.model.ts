import mongoose, { Schema, InferSchemaType } from 'mongoose';

const relationshipSchema = new Schema(
  {
    userA: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userB: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending', index: true },

    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    endedAt: { type: Date, default: null },

    resumedFromRelationshipId: { type: Schema.Types.ObjectId, ref: 'Relationship', default: null }
  },
  { timestamps: true }
);

relationshipSchema.index({ userA: 1, userB: 1, status: 1 });

export type Relationship = InferSchemaType<typeof relationshipSchema>;
export const RelationshipModel = mongoose.model('Relationship', relationshipSchema);
