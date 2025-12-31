import mongoose, { Schema, InferSchemaType } from 'mongoose';

const progressSchema = new Schema(
  {
    relationshipId: { type: Schema.Types.ObjectId, ref: 'Relationship', required: true, index: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },

    answerByUserA: { type: String, default: null },
    answerByUserB: { type: String, default: null },

    status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' }
  },
  { timestamps: true }
);

progressSchema.index({ relationshipId: 1, questionId: 1 }, { unique: true });

export type Progress = InferSchemaType<typeof progressSchema>;
export const ProgressModel = mongoose.model('Progress', progressSchema);
