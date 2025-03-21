import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { HabitEvent, HabitEventSchema } from './habits.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'HabitEvent', schema: HabitEventSchema }])],
  providers: [HabitsService],
  controllers: [HabitsController],
})
export class HabitsModule {}
