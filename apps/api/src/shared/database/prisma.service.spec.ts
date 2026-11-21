import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  it('does not require a database connection during application startup', async () => {
    const configService = { getOrThrow: jest.fn() };
    const module = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    expect(configService.getOrThrow).not.toHaveBeenCalled();
    await module.get(PrismaService).onModuleDestroy();
    expect(configService.getOrThrow).not.toHaveBeenCalled();
  });
});
