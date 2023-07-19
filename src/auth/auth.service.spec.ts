import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';
import { ActivateService } from '../email/activate/activate.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils/utils.service';
import { User } from '../users/entity';

const TEST_USER_ID = 'test_id';
const TEST_EMAIL = 'test@example.com';
const HASHED_PASSWORD = 'hashed-test-pass';
const TEST_PASSWORD = 'test_password';
const ACTIVATION_TOKEN = 'test-activation-token';

const getTestingModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [ConfigModule.forRoot(), Repository<User>],
    providers: [
      AuthService,
      ConfigService,
      {
        provide: UsersService,
        useValue: {
          activateById: jest.fn().mockResolvedValue({
            user: { id: TEST_USER_ID },
          }),
          findOneBy: jest.fn().mockResolvedValue({
            id: TEST_USER_ID,
            email: TEST_EMAIL,
            activated: true,
            hashedPassword: HASHED_PASSWORD,
          }),
          create: jest.fn().mockResolvedValue({
            id: TEST_USER_ID,
            email: TEST_EMAIL,
            hashedPassword: HASHED_PASSWORD,
          }),
        },
      },
      {
        provide: UtilsService,
        useValue: {
          hashPassword: jest.fn((password) => `password-${password}`),
        },
      },
      {
        provide: ActivateService,
        useValue: {
          sendActivationEmail: jest.fn(),
          getMjmlTemplate: jest
            .fn()
            .mockImplementation(() => '<p>Mock E-mail Template</p>'),
        },
      },
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn(() => ACTIVATION_TOKEN),
          verify: jest.fn((token) =>
            token === 'test-token' ? { id: TEST_USER_ID } : null,
          ),
        },
      },
      {
        provide: getRepositoryToken(User),
        useValue: {
          save: jest.fn().mockResolvedValue({
            id: TEST_USER_ID,
            email: TEST_EMAIL,
            hashedPassword: HASHED_PASSWORD,
          }),
        },
      },
      {
        provide: ConfigService,
        useValue: {
          get: jest.fn().mockImplementation((key) => {
            switch (key) {
              case 'auth':
                return { passwordSaltOrRounds: 10 };
              case 'email':
                return {
                  activateUrL: jest.fn().mockImplementation(() => 'test-url'),
                };
              default:
                return null;
            }
          }),
        },
      },
    ],
  }).compile();
};

describe('AuthService', () => {
  let service: AuthService;
  let utilsService: UtilsService;
  let jwtService: JwtService;
  let activateService: ActivateService;
  let usersService: UsersService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await getTestingModule();
    service = module.get<AuthService>(AuthService);
    utilsService = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
    activateService = module.get<ActivateService>(ActivateService);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(utilsService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(activateService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('sign-up', () => {
    it('should sign up a new user', async () => {
      const email = TEST_EMAIL;
      const password = TEST_PASSWORD;

      const signUpDto = {
        email,
        password,
      };

      const hashedPassword = utilsService.hashPassword(password);

      const result = await service.signUp(signUpDto);
      expect(result).toBeDefined();
      expect(result.id).toBe(TEST_USER_ID);
      expect(result.email).toBe(email);
      expect(utilsService.hashPassword).toHaveBeenCalledWith(password);
      expect(usersService.create).toHaveBeenCalledWith(email, hashedPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: TEST_USER_ID });
      expect(activateService.sendActivationEmail).toHaveBeenCalledWith(
        email,
        ACTIVATION_TOKEN,
      );
    });

    it('should send activation email with correct token', async () => {
      const signUpDto = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      };
      const user = {
        id: TEST_USER_ID,
        email: TEST_EMAIL,
        hashedPassword: HASHED_PASSWORD,
      };
      (usersService.create as jest.Mock).mockResolvedValue(user);

      await service.signUp(signUpDto);
      expect(activateService.sendActivationEmail).toHaveBeenCalledWith(
        TEST_EMAIL,
        ACTIVATION_TOKEN,
      );
    });

    it('should hash the password before saving', async () => {
      const signUpDto = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      };

      await service.signUp(signUpDto);

      expect(utilsService.hashPassword).toHaveBeenCalledWith(TEST_PASSWORD);
      expect(usersService.create).toHaveBeenCalledWith(
        TEST_EMAIL,
        `password-${TEST_PASSWORD}`,
      );
    });

    it('should sign the JWT token with the correct payload', async () => {
      const signUpDto = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      };

      await service.signUp(signUpDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ id: TEST_USER_ID });
    });

    it('should omit hashedPassword from the returned user data', async () => {
      const signUpDto = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      };

      const result = await service.signUp(signUpDto);
      expect(result).not.toHaveProperty('hashedPassword');
    });

    describe('errors', () => {
      it('should throw an error if user creation fails', async () => {
        const signUpDto = {
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
        };
        (usersService.create as jest.Mock).mockResolvedValue(null);

        await expect(service.signUp(signUpDto)).rejects.toThrow(
          'User could not be created.',
        );

        expect(utilsService.hashPassword).toHaveBeenCalledWith(TEST_PASSWORD);
        expect(usersService.create).toHaveBeenCalledWith(
          TEST_EMAIL,
          `password-${TEST_PASSWORD}`,
        );
        expect(jwtService.sign).not.toHaveBeenCalled();
        expect(activateService.sendActivationEmail).not.toHaveBeenCalled();
      });
    });
  });
});
