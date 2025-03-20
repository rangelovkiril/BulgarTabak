import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Habit } from './entities/habits.entity';
import { connect } from 'http2';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection: TypeOrmModuleOptions = {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: true, 
        };
        console.log('Connected to SupaBase Database: ', connection.url);
        return connection;
      },
    }),
    TypeOrmModule.forFeature([User, Habit]), 
  ],
})
export class DatabaseModule {}
