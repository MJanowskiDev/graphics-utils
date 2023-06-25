import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostgresError } from 'pg-error-enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositry: Repository<User>,
  ) {}

  async findOneBy(email: string): Promise<User | null> {
    return this.userRepositry.findOneBy({ email });
  }

  async create(email: string, hashedPassword: string): Promise<User | null> {
    const user = new User();
    user.email = email;
    user.hashedPassword = hashedPassword;
    try {
      const createdUser = await this.userRepositry.save(user);
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
