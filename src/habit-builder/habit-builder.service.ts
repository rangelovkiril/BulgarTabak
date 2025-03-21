import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { HabitEvent } from '../habits/habits.schema';
import moment from 'moment';

@Injectable()
export class HabitBuilderService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService
  ) {}

  // Analyze free time and create habit events
  async buildHabitsForUser(userId: string): Promise<HabitEvent[]> {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new Error('User not found');

    // Get the user's Google Calendar events for the next week
    const now = moment();
    const timeMin = now.toISOString();
    const timeMax = moment().add(1, 'week').toISOString();
    
    const events = await this.eventsService.getEvents(userId); // Fetch events from your database or Google Calendar
    const busyTimes = events.map((event) => ({
      start: moment(event.startTime),
      end: moment(event.endTime),
    }));

    const freeTimeSlots = this.getFreeTimeSlots(busyTimes);

    // Build habit events
    const habitEvents: HabitEvent[] = [];
    for (const slot of freeTimeSlots) {
      const habitEvent = this.createHabitEvent(userId, slot);
      habitEvents.push(habitEvent);
    }

    // Save the habit events to the database
    return habitEvents;
  }

  // Find free time slots between busy times
  private getFreeTimeSlots(busyTimes: { start: moment.Moment; end: moment.Moment }[]): any[] {
    const freeSlots: any[] = [];

    // Assume the workday is from 8 AM to 6 PM
    const startOfDay = moment().set({ hour: 8, minute: 0, second: 0 });
    const endOfDay = moment().set({ hour: 18, minute: 0, second: 0 });

    let lastEnd = startOfDay;

    // Sort busy times by start time
    busyTimes.sort((a, b) => a.start.isBefore(b.start) ? -1 : 1);

    for (const busy of busyTimes) {
      if (lastEnd.isBefore(busy.start)) {
        freeSlots.push({
          start: lastEnd,
          end: busy.start,
        });
      }
      lastEnd = busy.end;
    }

    // Add any remaining free time after the last event
    if (lastEnd.isBefore(endOfDay)) {
      freeSlots.push({
        start: lastEnd,
        end: endOfDay,
      });
    }

    return freeSlots;
  }

  // Create habit events for a given free time slot
  private createHabitEvent(userId: string, timeSlot: any): HabitEvent {
    const habitEvent: Partial<HabitEvent> = {
      userId: userId as string,
      habitType: 'sport', // This can be dynamic based on the user's preferences
      title: 'Exercise',
      description: 'Time to do a workout for your health.',
      startTime: timeSlot.start.toDate(),
      endTime: timeSlot.end.toDate(),
    } as HabitEvent;

    // Save the event to the database
    return habitEvent;
  }
}
