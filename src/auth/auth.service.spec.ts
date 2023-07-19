import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'aws-sdk';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../users/users.service';
import { ActivateService } from '../email/activate/activate.service';
import { AuthService } from './auth.service';
import { UtilsService } from './utils/utils.service';
import { User } from '../users/entity';

const mockEmailConfigService = {
  get: (key: string) => {
    if (key === 'email') {
      return {
        smtp: {
          port: 587,
          user: 'smtp-email',
          pass: 'smtp-password',
        },
        service: 'service-provider',
        templatePaths: {
          activate: './emailTemplates/activationEmail.mjml',
          welcome: './emailTemplates/welcomeEmail.mjml',
        },
        activateUrL: '/auth/activate?token=${token}',
      };
    }
  },
};

const getTestingModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [ConfigModule, Repository<User>],
    providers: [
      AuthService,
      UtilsService,
      ActivateService,
      UsersService,
      ConfigService,
      {
        provide: JwtService,
        useValue: {
          sign: jest.fn(() => 'test-signed-token'),
          verify: jest.fn((token) =>
            token === 'test-token' ? { id: 'test-id' } : null,
          ),
        },
      },
      {
        provide: getRepositoryToken(User),
        useClass: Repository,
      },
      {
        provide: 'EmailConfigService',
        useValue: mockEmailConfigService,
      },
    ],
  })
    .overrideProvider(ActivateService)
    .useValue({
      emailConfigService: mockEmailConfigService,
    })
    .compile();
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
});
