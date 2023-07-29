import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PasswordService } from '../utils/password.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockImplementation(async (p1: string, p2: string) => {
    return p1 === p2.replace(/^hashed-/i, '');
  }),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        PasswordService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'auth') {
                return { passwordSaltOrRounds: undefined };
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hashPassword', () => {
    it('should return a bcrypt hash of the password', async () => {
      const password = 'password';
      const hashedPassword = await service.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toEqual(password);
      expect(hashedPassword.length).toBeGreaterThan(password.length);
      expect(hashedPassword).toEqual('hashedPassword');
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      // Arrange
      const password = 'password';
      const hashedPassword = 'hashed-password';

      // Act
      const result = await service.comparePasswords(password, hashedPassword);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const incorrectPassword = 'wrongPassword';
      const hashedPassword = 'hashed-Password';

      const result = await service.comparePasswords(
        incorrectPassword,
        hashedPassword,
      );

      expect(result).toBe(false);
    });
  });
});
