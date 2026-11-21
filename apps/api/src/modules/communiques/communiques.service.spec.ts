import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/database/prisma.service';
import { CommuniquesService } from './communiques.service';

describe('CommuniquesService', () => {
  const communique = {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  };
  let service: CommuniquesService;

  beforeEach(async () => {
    communique.count.mockReset();
    communique.findMany.mockReset();
    communique.findFirst.mockReset();
    const module = await Test.createTestingModule({
      providers: [
        CommuniquesService,
        {
          provide: PrismaService,
          useValue: { client: { communique } },
        },
      ],
    }).compile();

    service = module.get(CommuniquesService);
  });

  it('lists only published communiques with stable pagination metadata', async () => {
    const data = [{ slug: 'aviso', title: 'Aviso' }];
    communique.findMany.mockResolvedValue(data);
    communique.count.mockResolvedValue(4);

    await expect(
      service.listPublished({ limit: 2, offset: 1 }),
    ).resolves.toEqual({
      data,
      pagination: { limit: 2, offset: 1, total: 4 },
    });
    expect(communique.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'PUBLISHED' },
        skip: 1,
        take: 2,
      }),
    );
    expect(communique.count).toHaveBeenCalledWith({
      where: { status: 'PUBLISHED' },
    });
  });

  it('loads published details and their translations by slug', async () => {
    const data = { slug: 'aviso', translations: [] };
    communique.findFirst.mockResolvedValue(data);

    await expect(service.findPublishedBySlug('aviso')).resolves.toBe(data);
    expect(communique.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: 'aviso', status: 'PUBLISHED' },
      }),
    );
  });
});
