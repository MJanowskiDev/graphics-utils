import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  HttpStatus,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  AccessTokenDto,
  ActivateDto,
  SignInDto,
  SignUpDto,
  UserDto,
} from './dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn<Promise<AccessTokenDto>, [SignInDto]>(),
    signUp: jest.fn<Promise<UserDto>, [SignUpDto]>(),
    activate: jest.fn<Promise<ActivateDto>, [token: string]>(),
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
      const user = new UserDto();
      mockAuthService.signUp.mockResolvedValue(user);

      const result = await authController.register(signUpDto);

      expect(result).toBe(user);
      expect(result).not.toHaveProperty('hashedPassword');
      expect(result).not.toHaveProperty('password');
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
    });

    describe('handle errors', () => {
      it('should throw CONFLICT error when user already exists', async () => {
        const signUpDto = { email: 'dummy@example.com', password: 'password' };
        mockAuthService.signUp.mockRejectedValue(
          new ConflictException('This email already exists.'),
        );

        try {
          await authController.register(signUpDto);
        } catch (error) {
          expect(error.response).toBeDefined();
          expect(error.response.statusCode).toBe(HttpStatus.CONFLICT);
          expect(error.response.message).toEqual('This email already exists.');
        }
      });

      it('should throw BAD_REQUEST error if password doesnt match requirements', async () => {
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
        expect(error.getResponse().statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(error.getResponse().message).toEqual([
          'Password must contain at least 8 characters, including one letter, one number, and one special character',
        ]);
      });

      it('should throw BAD_REQUEST error if the invalid email provided', async () => {
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
        expect(error.getResponse().statusCode).toBe(HttpStatus.BAD_REQUEST);
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

      it('should throw BAD_REQUEST error if the invalid email provided', async () => {
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
        expect(error.getResponse().statusCode).toBe(HttpStatus.BAD_REQUEST);
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

  describe('activate', () => {
    it('should be public', () => {
      const decorators = Reflect.getMetadataKeys(authController.activate);
      expect(decorators).toContain('isPublic');
    });

    it('should activate user by token, and return message', async () => {
      const activateDto: ActivateDto = {
        result: 'success',
        message: 'User activated successfully',
      };

      mockAuthService.activate.mockResolvedValue(activateDto);
      const result = await authController.activate('token');

      expect(result).toBe(activateDto);
      expect(result).toHaveProperty('result');
      expect(result).toHaveProperty('message');
      expect(mockAuthService.activate).toHaveBeenCalledWith('token');
    });

    it('should return message when user is already activated', async () => {
      const activateDto: ActivateDto = {
        result: 'success',
        message: 'User is already activated',
      };

      mockAuthService.activate.mockResolvedValue(activateDto);
      const result = await authController.activate('token');
      expect(result).toBe(activateDto);
      expect(mockAuthService.activate).toHaveBeenCalledWith('token');
    });

    describe('handle errors', () => {
      it('should throw BAD_REQUEST error when invalid token passed', async () => {
        mockAuthService.activate.mockRejectedValue(
          new BadRequestException('Invalid token'),
        );

        try {
          await authController.activate('');
        } catch (error) {
          expect(error.response).toBeDefined();
          expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(error.response.message).toEqual('Invalid token');
        }
      });

      it('should throw BAD_REQUEST error when user to activate not found', async () => {
        mockAuthService.activate.mockRejectedValue(
          new BadRequestException('User not found'),
        );

        try {
          await authController.activate('');
        } catch (error) {
          expect(error.response).toBeDefined();
          expect(error.response.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(error.response.message).toEqual('User not found');
        }
      });
    });
  });
});
