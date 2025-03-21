import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async createUser(email: string, googleCalendarId: string): Promise<User> {
    const user = new this.userModel({
      email,
      googleCalendarId,
      preferences: { habitTypes: [], goalSettings: {} },
    });
    return user.save();
  }

  async findUserById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
}
