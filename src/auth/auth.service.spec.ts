import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { ActivateService } from '../email/activate/activate.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils/utils.service';
import { User } from '../users/entity';

const HASHED_PREFIX = 'hashed-';
const TEST_USER_ID = 'test_id';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test_password';
const HASHED_PASSWORD = `${HASHED_PREFIX}${TEST_PASSWORD}`;
const TEST_ROLE = 'user';
const ACTIVATE_TEST_TOKEN = 'activate-test-token';

const getTestingModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [ConfigModule.forRoot(), Repository<User>],
    providers: [
      AuthService,
      {
        provide: UsersService,
        useValue: {
          activateById: jest.fn().mockResolvedValue({
            user: {
              id: TEST_USER_ID,
              email: TEST_EMAIL,
              activated: true,
              role: TEST_ROLE,
              hashedPassword: HASHED_PASSWORD,
            },
            wasAlreadyActivated: false,
          }),
          findOneBy: jest.fn().mockImplementation((email) => {
            if (email === TEST_EMAIL) {
              return Promise.resolve({
                id: TEST_USER_ID,
                email: TEST_EMAIL,
                activated: true,
                role: TEST_ROLE,
                hashedPassword: HASHED_PASSWORD,
              });
            } else {
              return Promise.resolve(null);
            }
          }),
          create: jest.fn().mockResolvedValue({
            id: TEST_USER_ID,
            email: TEST_EMAIL,
          }),
        },
      },
      {
        provide: UtilsService,
        useValue: {
          hashPassword: jest.fn((password) => `${HASHED_PREFIX}${password}`),
          comparePasswords: jest.fn((password, hashedPassword) => {
            return password === hashedPassword.replace(HASHED_PREFIX, '');
          }),
        },
      },
      {
        provide: ActivateService,
        useValue: {
          sendActivationEmail: jest.fn(),
          sendWelcomeEmail: jest.fn(),
          getMjmlTemplate: jest
            .fn()
            .mockImplementation(() => '<p>Mock E-mail Template</p>'),
        },
      },
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn((o) => {
            return JSON.stringify(o);
          }),
          verify: jest.fn((token) =>
            token === ACTIVATE_TEST_TOKEN ? { id: TEST_USER_ID } : null,
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

  beforeEach(async () => {
    const module = await getTestingModule();
    service = module.get<AuthService>(AuthService);
    utilsService = module.get<UtilsService>(UtilsService);
    jwtService = module.get<JwtService>(JwtService);
    activateService = module.get<ActivateService>(ActivateService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined with activate, signIn, signUp methods', () => {
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AuthService);
    expect(service.activate).toBeDefined();
    expect(service.signIn).toBeDefined();
    expect(service.signUp).toBeDefined();
  });

  describe('sign-up', () => {
    it('should sign up a new user', async () => {
      const email = TEST_EMAIL;
      const password = TEST_PASSWORD;
      const signUpDto = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
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
        JSON.stringify({ id: TEST_USER_ID }),
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
        JSON.stringify({ id: TEST_USER_ID }),
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
        `${HASHED_PREFIX}${TEST_PASSWORD}`,
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
          `${HASHED_PREFIX}${TEST_PASSWORD}`,
        );
        expect(jwtService.sign).not.toHaveBeenCalled();
        expect(activateService.sendActivationEmail).not.toHaveBeenCalled();
      });
    });
  });

  describe('sign-in', () => {
    it('should sign in a user and return jwt when succeded', async () => {
      const signInDto = { email: TEST_EMAIL, password: TEST_PASSWORD };
      const { id, email, role } = (await usersService.findOneBy(
        TEST_EMAIL,
      )) as User;

      await service.signIn(signInDto);

      expect(usersService.findOneBy).toHaveBeenCalledWith(TEST_EMAIL);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id,
        email,
        role,
      });
      expect(service.signIn(signInDto)).resolves.toEqual({
        access_token: JSON.stringify({
          id,
          email,
          role,
        }),
      });
    });

    describe('errors', () => {
      it('should throw an error if user is not found', async () => {
        const signInDto = {
          email: 'non-existing-email',
          password: TEST_PASSWORD,
        };

        await expect(service.signIn(signInDto)).rejects.toThrow(
          UnauthorizedException,
        );

        expect(utilsService.comparePasswords).not.toHaveBeenCalled();
        expect(jwtService.sign).not.toHaveBeenCalled();
      });

      it('should throw an error if user is not activated', async () => {
        const signInDto = {
          email: 'not-activated',
          password: TEST_PASSWORD,
        };

        jest
          .spyOn(usersService, 'findOneBy')
          .mockImplementation(async (email) => {
            return Promise.resolve<User | null>({
              id: TEST_USER_ID,
              email,
              activated: false,
              role: '' as any,
              hashedPassword: HASHED_PASSWORD,
              tokenId: '123',
              created_at: new Date(),
              updated_at: new Date(),
            });
          });

        await expect(service.signIn(signInDto)).rejects.toThrow(
          new UnauthorizedException('Please activate your account first.'),
        );
        expect(utilsService.comparePasswords).not.toHaveBeenCalled();
        expect(jwtService.sign).not.toHaveBeenCalled();
      });

      it('should throw an error if password does not match', async () => {
        const signInDto = {
          email: TEST_EMAIL,
          password: 'wrong-password',
        };

        await expect(service.signIn(signInDto)).rejects.toThrow(
          UnauthorizedException,
        );

        expect(utilsService.comparePasswords).toHaveBeenCalledWith(
          signInDto.password,
          HASHED_PASSWORD,
        );
        expect(jwtService.sign).not.toHaveBeenCalled();
      });
    });
  });

  describe('activate', () => {
    it('should activate a user', async () => {
      const token = ACTIVATE_TEST_TOKEN;

      await service.activate(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(usersService.activateById).toHaveBeenCalledWith(TEST_USER_ID);
      expect(activateService.sendWelcomeEmail).toHaveBeenCalledWith(TEST_EMAIL);

      expect(service.activate(token)).resolves.toEqual({
        result: 'success',
        message: 'User activated successfully',
      });
    });

    it('should return a success message if user was already activated', async () => {
      const token = ACTIVATE_TEST_TOKEN;

      jest.spyOn(usersService, 'activateById').mockResolvedValue({
        user: new User(),
        wasAlreadyActivated: true,
      });

      await service.activate(token);

      expect(service.activate(token)).resolves.toEqual({
        result: 'success',
        message: 'User is already activated',
      });
    });

    it('should send a welcome email if user was not activated', async () => {
      await service.activate(ACTIVATE_TEST_TOKEN);

      expect(activateService.sendWelcomeEmail).toHaveBeenCalledWith(TEST_EMAIL);
    });

    describe('errors', () => {
      it('should throw an error if token is invalid', async () => {
        jest.spyOn(jwtService, 'verify').mockImplementation(() => {
          throw new Error('Invalid token');
        });

        const invalidToken = 'invalid-token';

        expect(service.activate(invalidToken)).rejects.toThrow(
          new BadRequestException('Invalid token'),
        );
        expect(jwtService.verify).toHaveBeenCalledWith(invalidToken);
      });

      it('should throw an error if user is not found', async () => {
        const token = ACTIVATE_TEST_TOKEN;

        jest.spyOn(usersService, 'activateById').mockResolvedValue({
          user: null as any,
          wasAlreadyActivated: false,
        });

        await expect(service.activate(token)).rejects.toThrow(
          new BadRequestException('User not found'),
        );
      });
    });
  });
});
