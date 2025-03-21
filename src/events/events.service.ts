import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './events.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel('Event') private eventModel: Model<Event>) {}

  async createEvent(userId: string, eventId: string, title: string, startTime: Date, endTime: Date, isHabit: boolean): Promise<Event> {
    const event = new this.eventModel({
      userId,
      eventId,
      title,
      startTime,
      endTime,
      isHabit,
    });
    return event.save();
  }

  async getEvents(userId: string): Promise<Event[]> {
    return this.eventModel.find({ userId }).exec();
  }
}
