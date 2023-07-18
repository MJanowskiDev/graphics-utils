import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentMetadata,
  ConflictException,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenDto, SignInDto, SignUpDto, UserDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn<Promise<AccessTokenDto>, [SignInDto]>(),
    signUp: jest.fn<Promise<UserDto>, [SignUpDto]>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: SignUpDto,
      data: '',
    };

    it('should be public', () => {
      const decorators = Reflect.getMetadataKeys(authController.register);
      expect(decorators).toContain('isPublic');
    });

    it('should sign up a user and return the user without password', async () => {
      const signUpDto: SignUpDto = {
        email: 'dummy@example.com',
        password: 'password',
      };
      const user: UserDto = {
        email: 'dummy@example.com',
        role: null,
        id: '6d160cc4-a36b-4596-8b50-bf11760f3308',
        activated: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockAuthService.signUp.mockResolvedValue(user);
      const result = await authController.register(signUpDto);

      expect(result).toBe(user);
      expect(result).not.toHaveProperty('hashedPassword');
      expect(result).not.toHaveProperty('password');
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    describe('handle errors', () => {
      it('should throw 409 conflict error when user already exists', async () => {
        const signUpDto = { email: 'dummy@example.com', password: 'password' };

        mockAuthService.signUp.mockRejectedValue(
          new ConflictException('This email already exists.'),
        );

        try {
          await authController.register(signUpDto);
        } catch (error) {
          expect(error.response).toBeDefined();
          expect(error.response.statusCode).toBe(409);
          expect(error.response.message).toEqual('This email already exists.');
        }
      });

      it('should throw 400 error if password doesnt match requirements', async () => {
        const signUpDto: SignUpDto = {
          email: 'dummy@example.com',
          password: 'badpassword',
        };

        const validationPipe = new ValidationPipe();
        let error: any;
        try {
          await validationPipe.transform(signUpDto, metadata);
        } catch (e) {
          error = e;
        }

        expect(error).toBeDefined();
        expect(error.getResponse().statusCode).toBe(400);
        expect(error.getResponse().message).toEqual([
          'Password must contain at least 8 characters, including one letter, one number, and one special character',
        ]);
      });

      it('should throw 400 error if the invalid email provided', async () => {
        const signUpDto: SignUpDto = {
          email: 'invalid_email',
          password: 'This!s4ValidPassword',
        };

        const validationPipe = new ValidationPipe();
        let error: any;
        try {
          await validationPipe.transform(signUpDto, metadata);
        } catch (e) {
          error = e;
        }

        expect(error).toBeDefined();
        expect(error.getResponse().statusCode).toBe(400);
        expect(error.getResponse().message).toEqual([
          'Please provide a valid email address',
        ]);
      });
    });
  });

  describe('signIn', () => {
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: SignInDto,
      data: '',
    };

    it('should be public', () => {
      const decorators = Reflect.getMetadataKeys(authController.signIn);
      expect(decorators).toContain('isPublic');
    });

    it('should sign in a user and return the JWT token', async () => {
      const token: AccessTokenDto = new AccessTokenDto();
      mockAuthService.signIn.mockResolvedValue(token);

      const signInDto: SignInDto = {
        email: 'dummy@example.com',
        password: 'password',
      };

      const result = await authController.signIn(signInDto);

      expect(result).toBe(token);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
    });

    describe('handle errors', () => {
      it('should throw Unauthorized error if no credentials provided', async () => {
        const signInDto = { email: '', password: '' };
        mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

        await expect(authController.signIn(signInDto)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it('should throw 400 error if the invalid email provided', async () => {
        const signInDto: SignInDto = {
          email: 'invalid-email',
          password: 'password',
        };

        const validationPipe = new ValidationPipe();
        let error: any;
        try {
          await validationPipe.transform(signInDto, metadata);
        } catch (e) {
          error = e;
        }

        expect(error).toBeDefined();
        expect(error.getResponse().statusCode).toBe(400);
        expect(error.getResponse().message).toEqual([
          'Please provide a valid email address',
        ]);
      });

      it('should throw Unauthorized error when wrong password is passed', async () => {
        const signInDto: SignInDto = {
          email: 'dummy@example.com',
          password: 'wrong-password',
        };

        const error = new UnauthorizedException();
        mockAuthService.signIn.mockRejectedValue(error);

        await expect(authController.signIn(signInDto)).rejects.toThrowError(
          error,
        );
        expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      });

      it('should throw Unauthorized error if non existing email is passed', async () => {
        const signInDto = { email: 'wrong@example.com', password: 'password' };
        mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

        await expect(authController.signIn(signInDto)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });
  });
});
