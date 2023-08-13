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

  async activateById(id: string): Promise<{ user: User; wasAlreadyActivated: boolean }> {
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

  findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByPasswordResetToken(token: string): Promise<User | null> {
    return this.userRepository.findOneBy({ passwordResetToken: token });
  }

  updateUserPassword(userId: string, hashedPassword: string) {
    return this.userRepository.update(userId, { hashedPassword });
  }

  updateTokenId(userId: string, tokenId: string | null): Promise<UpdateResult> {
    return this.userRepository.update(userId, { tokenId });
  }

  async softDeleteAndUpdateEmail(userId: string, email: string) {
    return this.userRepository.update(userId, { email, deleted: true });
  }

  async updatePasswordResetToken(token: string | null, userId: string) {
    return this.userRepository.update(userId, { passwordResetToken: token });
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
