import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(@Body() body: { email: string; googleCalendarId: string }): Promise<any> {
    return await this.usersService.createUser(body.email, body.googleCalendarId);
  }
}
