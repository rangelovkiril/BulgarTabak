import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async createHabitEvent(@Body() body: { userId: string; habitType: string; title: string; description: string; startTime: Date; endTime: Date }) {
    return this.habitsService.createHabitEvent(
      body.userId,
      body.habitType,
      body.title,
      body.description,
      body.startTime,
      body.endTime
    );
  }

  @Get(':userId')
  async getHabitEvents(@Param('userId') userId: string) {
    return this.habitsService.getHabitEvents(userId);
  }
}
