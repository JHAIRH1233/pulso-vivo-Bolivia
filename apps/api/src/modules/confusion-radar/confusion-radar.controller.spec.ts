import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { ConfusionRadarController } from './confusion-radar.controller';
import { ConfusionRadarService } from './confusion-radar.service';

describe('ConfusionRadarController', () => {
  const confusionRadarService = {
    analyze: jest.fn(),
    listClusters: jest.fn(),
  };
  let controller: ConfusionRadarController;

  beforeEach(async () => {
    confusionRadarService.analyze.mockReset();
    confusionRadarService.listClusters.mockReset();
    const module = await Test.createTestingModule({
      controllers: [ConfusionRadarController],
      providers: [
        { provide: ConfusionRadarService, useValue: confusionRadarService },
      ],
    })
      .overrideGuard(InstitutionApiKeyGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get(ConfusionRadarController);
  });

  it('accepts analysis without a communiqué filter', () => {
    const result = { analyzedQuestionCount: 0, clusters: [] };
    confusionRadarService.analyze.mockReturnValue(result);

    expect(controller.analyze({})).toBe(result);
    expect(confusionRadarService.analyze).toHaveBeenCalledWith(undefined);
  });

  it('rejects invalid request bodies and communiqué IDs', () => {
    expect(() => controller.analyze(null)).toThrow(BadRequestException);
    expect(() => controller.analyze({ communiqueId: 'not-a-uuid' })).toThrow(
      BadRequestException,
    );
    expect(() => controller.list('not-a-uuid')).toThrow(BadRequestException);
    expect(confusionRadarService.analyze).not.toHaveBeenCalled();
    expect(confusionRadarService.listClusters).not.toHaveBeenCalled();
  });

  it('forwards a valid communiqué filter to both endpoints', () => {
    const communiqueId = 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc';
    confusionRadarService.analyze.mockReturnValue({});
    confusionRadarService.listClusters.mockReturnValue([]);

    controller.analyze({ communiqueId });
    controller.list(communiqueId);

    expect(confusionRadarService.analyze).toHaveBeenCalledWith(communiqueId);
    expect(confusionRadarService.listClusters).toHaveBeenCalledWith(
      communiqueId,
    );
  });
});
