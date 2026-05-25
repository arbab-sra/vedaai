import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Challenging';
  marks: number;
  options?: string[];
}

export interface ISection {
  title: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IQuestionPaper {
  institutionName?: string;
  topic?: string;
  targetAudience?: string;
  timeAllowed?: string;
  maximumMarks?: number;
  sections: ISection[];
  answerKey: string[];
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  status: 'PENDING' | 'EXTRACTING_TEXT' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  difficulty?: string;
  targetAudience?: string;
  syllabusText?: string;
  configuration: {
    questionTypes: Array<{ type: string; count: number; marks: number }>;
    totalQuestions: number;
    totalMarks: number;
    instructions?: string;
  };
  generatedPaper?: IQuestionPaper;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'EXTRACTING_TEXT', 'GENERATING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
      default: 'Mixed',
    },
    targetAudience: { type: String, default: 'All Learners' },
    syllabusText: { type: String, default: '' },
    configuration: {
      questionTypes: [
        {
          type: { type: String },
          count: { type: Number },
          marks: { type: Number },
        },
      ],
      totalQuestions: { type: Number, required: true },
      totalMarks: { type: Number, required: true },
      instructions: { type: String },
    },
    generatedPaper: {
      institutionName: String,
      topic: String,
      targetAudience: String,
      timeAllowed: String,
      maximumMarks: Number,
      sections: [
        {
          title: String,
          instruction: String,
          questions: [
            {
              questionText: String,
              difficulty: String,
              marks: Number,
              options: [String],
            },
          ],
        },
      ],
      answerKey: [String],
    },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
