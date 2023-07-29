import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from 'aws-sdk';

import { TokenService } from './token.service';
import { UserTokenPayloadDto, ActivateTokenPayloadDto } from '../dto';

const getTestingModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    providers: [
      TokenService,
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn().mockReturnValue('mockToken'),
          verify: jest.fn().mockReturnValue({}),
        },
      },
      {
        provide: ConfigService,
        useValue: {
          get: jest.fn().mockReturnValue({ authJwtSecret: 'secret' }),
        },
      },
    ],
  }).compile();
};

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await getTestingModule();
    service = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('generateTokenId', () => {
    it('should return a token in uuid format', async () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

      const token = await service.generateTokenId();

      expect(token).toBeDefined();
      expect(token).toMatch(uuidRegex);
    });
  });

  describe('decodeUserToken', () => {
    it('should return a decoded token object with valid properties', async () => {
      const token = 'valid-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => ({
        id: 1,
        tokenId: 'some-token-id',
        role: 'user',
      }));

      const decoded = await service.decodeUserToken(token);

      expect(decoded).toBeDefined();
      expect(decoded).toBeInstanceOf(UserTokenPayloadDto);
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('tokenId');
      expect(decoded).toHaveProperty('role');
    });

    it('should throw an error when failed to verify', async () => {
      const token = 'wrong-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.decodeUserToken(token);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid token');
      }
    });

    it('should throw an error when invalid token payload extracted', async () => {
      const token = 'wrong-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        return {} as any;
      });

      try {
        await service.decodeUserToken(token);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid token payload');
      }
    });
  });

  describe('decodeActivateToken', () => {
    it('should return a decoded token object with valid properties', async () => {
      const token = 'valid-activate-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => ({
        id: '1',
      }));

      const decoded = await service.decodeActivateToken(token);

      expect(decoded).toBeDefined();
      expect(decoded).toBeInstanceOf(ActivateTokenPayloadDto);
      expect(decoded).toHaveProperty('id');
    });

    it('should throw an error when failed to verify', async () => {
      const token = 'wrong-activate-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.decodeActivateToken(token);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid token');
      }
    });

    it('should throw an error when invalid token payload extracted', async () => {
      const token = 'wrong-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        return {} as any;
      });

      try {
        await service.decodeActivateToken(token);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid token payload');
      }
    });
  });

  describe('signPayload', () => {
    it('should return a signed token for UserTokenPayloadDto', async () => {
      const payload: UserTokenPayloadDto = {
        id: '1',
        tokenId: 'some-token-id',
        role: null,
      };

      const token = service.signPayload(payload);

      expect(token).toBeDefined();
    });

    it('should return a signed token for ActivateTokenPayloadDto', async () => {
      const payload: ActivateTokenPayloadDto = {
        id: '1',
      };

      const token = service.signPayload(payload);

      expect(token).toBeDefined();
    });
  });
});
