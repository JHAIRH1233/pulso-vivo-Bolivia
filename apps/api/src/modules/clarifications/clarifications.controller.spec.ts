import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { ClarificationsController } from './clarifications.controller';
import { ClarificationsService } from './clarifications.service';

describe('ClarificationsController', () => {
  const clarificationsService = {
    listForReview: jest.fn(),
    listPublished: jest.fn(),
    createDraft: jest.fn(),
    createDraftFromCluster: jest.fn(),
    updateDraft: jest.fn(),
    submitForReview: jest.fn(),
    publish: jest.fn(),
  };
  let controller: ClarificationsController;

  beforeEach(async () => {
    Object.values(clarificationsService).forEach((mock) => mock.mockReset());
    const module = await Test.createTestingModule({
      controllers: [ClarificationsController],
      providers: [
        { provide: ClarificationsService, useValue: clarificationsService },
      ],
    })
      .overrideGuard(InstitutionApiKeyGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get(ClarificationsController);
  });

  it('validates input sizes and identifiers before calling the service', () => {
    expect(() =>
      controller.createDraft({
        title: 'A'.repeat(241),
        content: 'Contenido',
      }),
    ).toThrow(BadRequestException);
    expect(() =>
      controller.createDraftFromCluster({ clusterId: 'not-a-uuid' }),
    ).toThrow(BadRequestException);
    expect(() => controller.listForReview('UNKNOWN')).toThrow(
      BadRequestException,
    );
    expect(clarificationsService.createDraft).not.toHaveBeenCalled();
    expect(
      clarificationsService.createDraftFromCluster,
    ).not.toHaveBeenCalled();
  });

  it('normalizes and forwards a valid manual draft', () => {
    const result = { id: 'draft-1' };
    clarificationsService.createDraft.mockReturnValue(result);

    expect(
      controller.createDraft({
        title: '  Aclaración  ',
        content: '  Texto oficial  ',
      }),
    ).toBe(result);
    expect(clarificationsService.createDraft).toHaveBeenCalledWith({
      title: 'Aclaración',
      content: 'Texto oficial',
    });
  });

  it('rejects empty updates', () => {
    expect(() => controller.updateDraft('draft-1', {})).toThrow(
      BadRequestException,
    );
    expect(clarificationsService.updateDraft).not.toHaveBeenCalled();
  });
});
