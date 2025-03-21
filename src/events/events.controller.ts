import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() body: { userId: string; eventId: string; title: string; startTime: Date; endTime: Date; isHabit: boolean }) {
    return this.eventsService.createEvent(
      body.userId,
      body.eventId,
      body.title,
      body.startTime,
      body.endTime,
      body.isHabit
    );
  }

  @Get(':userId')
  async getEvents(@Param('userId') userId: string) {
    return this.eventsService.getEvents(userId);
  }
}
