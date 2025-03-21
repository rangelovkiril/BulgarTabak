import { Schema, Document } from 'mongoose';

export interface HabitEvent extends Document {
  userId: string;
  habitType: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

export const HabitEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  habitType: { type: String, enum: ['sport', 'sleep', 'language'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
}, { timestamps: true });
