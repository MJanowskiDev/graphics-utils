import { Test, TestingModule } from '@nestjs/testing';
import {
  ArgumentMetadata,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenDto, SignInDto } from './dto';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signIn: jest.fn<Promise<AccessTokenDto>, [SignInDto]>(),
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
