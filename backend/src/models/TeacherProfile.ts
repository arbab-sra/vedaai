import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherProfile extends Document {
  fullName: string;
  organizationName: string;
  occupation: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherProfileSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    organizationName: { type: String, required: true },
    occupation: { type: String, required: true },
  },
  { timestamps: true }
);

export const TeacherProfile = mongoose.models.TeacherProfile || mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
