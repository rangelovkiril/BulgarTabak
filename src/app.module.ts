import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { HabitsModule } from './habits/habits.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    DatabaseConfig,
    UsersModule,
    EventsModule,
    HabitsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
