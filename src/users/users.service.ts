import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PostgresError } from 'pg-error-enum';

import { User } from './entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async activateById(
    id: string,
  ): Promise<{ user: User; wasAlreadyActivated: boolean }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    const wasAlreadyActivated = user.activated;

    user.activated = true;

    return { user: await this.userRepository.save(user), wasAlreadyActivated };
  }

  async findOneBy(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async updateTokenId(userId: string, tokenId: string): Promise<UpdateResult> {
    return await this.userRepository.update(userId, { tokenId });
  }

  async create(email: string, hashedPassword: string): Promise<User | null> {
    const user = new User();
    user.email = email;
    user.hashedPassword = hashedPassword;
    try {
      const createdUser = await this.userRepository.save(user);
      return createdUser;
    } catch (error) {
      if (error.code === PostgresError.UNIQUE_VIOLATION) {
        throw new ConflictException('This email already exists.');
      } else {
        console.error(error);
        throw error;
      }
    }
  }
}
