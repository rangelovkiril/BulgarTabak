import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Habit } from './entities/habits.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
    imports: 
    [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'password',
            database: 'habit_tracker',
            entities: [User, Habit],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Habit]),
    ],
    providers: [UserRepository],
    exports: [UserRepository],
})
export class DatabaseModule {}
