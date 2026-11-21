import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CommuniquesController } from './communiques.controller';
import { CommuniquesService } from './communiques.service';

describe('CommuniquesController', () => {
  const communiquesService = {
    listPublished: jest.fn(),
    findPublishedBySlug: jest.fn(),
  };
  let controller: CommuniquesController;

  beforeEach(async () => {
    communiquesService.listPublished.mockReset();
    communiquesService.findPublishedBySlug.mockReset();
    const module = await Test.createTestingModule({
      controllers: [CommuniquesController],
      providers: [
        { provide: CommuniquesService, useValue: communiquesService },
      ],
    }).compile();

    controller = module.get(CommuniquesController);
  });

  it('uses the default pagination values', () => {
    const result = { data: [], pagination: { limit: 20, offset: 0, total: 0 } };
    communiquesService.listPublished.mockReturnValue(result);

    expect(controller.list()).toBe(result);
    expect(communiquesService.listPublished).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
    });
  });

  it('validates pagination query parameters', () => {
    expect(() => controller.list('0', '0')).toThrow(BadRequestException);
    expect(() => controller.list('101', '0')).toThrow(BadRequestException);
    expect(() => controller.list('10.5', '0')).toThrow(BadRequestException);
    expect(() => controller.list('10', '-1')).toThrow(BadRequestException);
    expect(communiquesService.listPublished).not.toHaveBeenCalled();
  });

  it('returns a published communique by slug', async () => {
    const communique = { slug: 'aviso', title: 'Aviso' };
    communiquesService.findPublishedBySlug.mockResolvedValue(communique);

    await expect(controller.getBySlug('aviso')).resolves.toBe(communique);
    expect(communiquesService.findPublishedBySlug).toHaveBeenCalledWith(
      'aviso',
    );
  });

  it('returns not found when no published communique matches the slug', async () => {
    communiquesService.findPublishedBySlug.mockResolvedValue(null);

    await expect(controller.getBySlug('borrador')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
