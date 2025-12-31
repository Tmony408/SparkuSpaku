import mongoose, { Schema, InferSchemaType } from 'mongoose';

const questionSchema = new Schema(
  {
    text: { type: String, required: true },
    category: { type: String, default: 'general' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export type Question = InferSchemaType<typeof questionSchema>;
export const QuestionModel = mongoose.model('Question', questionSchema);
