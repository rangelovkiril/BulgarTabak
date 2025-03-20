import {Injectable} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(googleId: string, email: string, username: string): Promise<User> {
        const user = this.userRepository.create({ googleId, email, username });
        return await this.userRepository.save(user); 
      }
      

    async findUserByGoogleId(googleId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { googleId } });
      }
}