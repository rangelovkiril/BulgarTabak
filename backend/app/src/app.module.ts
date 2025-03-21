import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true, // makes the config available everywhere without re-importing
    envFilePath: '.env', // optional, default is '.env'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
