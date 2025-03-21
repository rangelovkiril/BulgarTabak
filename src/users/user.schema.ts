import { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  googleCalendarId: string;
  preferences: {
    habitTypes: string[];
    goalSettings: {
      sport: number;
      sleep: number;
      language: string;
    };
  };
}

export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  googleCalendarId: { type: String, required: true },
  preferences: {
    habitTypes: [String],
    goalSettings: {
      sport: { type: Number },
      sleep: { type: Number },
      language: { type: String },
    },
  },
}, { timestamps: true });
