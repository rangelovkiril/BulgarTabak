import { Schema, Document } from 'mongoose';

export interface Event extends Document {
  userId: string;
  eventId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isHabit: boolean;
}

export const EventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: String, required: true },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isHabit: { type: Boolean, default: false },
}, { timestamps: true });
