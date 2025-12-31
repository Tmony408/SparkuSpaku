import mongoose, { Schema, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, unique: true, index: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    displayName: { type: String, default: null },
    authProvider: { type: String, enum: ['email', 'google'], required: true },

    isVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, default: null },
    emailVerificationExpiresAt: { type: Date, default: null },

    googleId: { type: String, index: true, default: null },

    activeRelationshipId: { type: Schema.Types.ObjectId, ref: 'Relationship', default: null }
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model('User', userSchema);
