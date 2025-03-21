import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HabitEvent } from './habits.schema';

@Injectable()
export class HabitsService {
  constructor(@InjectModel('HabitEvent') private habitEventModel: Model<HabitEvent>) {}

  async createHabitEvent(userId: string, habitType: string, title: string, description: string, startTime: Date, endTime: Date): Promise<HabitEvent> {
    const habitEvent = new this.habitEventModel({
      userId,
      habitType,
      title,
      description,
      startTime,
      endTime,
    });
    return habitEvent.save();
  }

  async getHabitEvents(userId: string): Promise<HabitEvent[]> {
    return this.habitEventModel.find({ userId }).exec();
  }
}
