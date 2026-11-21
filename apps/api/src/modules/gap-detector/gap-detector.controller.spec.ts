import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GapDetectorController } from './gap-detector.controller';
import { GapDetectorService } from './gap-detector.service';

describe('GapDetectorController', () => {
  const gapDetectorService = {
    analyze: jest.fn(),
  };
  let controller: GapDetectorController;

  beforeEach(async () => {
    gapDetectorService.analyze.mockReset();
    const module = await Test.createTestingModule({
      controllers: [GapDetectorController],
      providers: [
        { provide: GapDetectorService, useValue: gapDetectorService },
      ],
    }).compile();

    controller = module.get(GapDetectorController);
  });

  it('rejects missing and blank text', async () => {
    expect(() => controller.analyze({})).toThrow(BadRequestException);
    expect(() => controller.analyze({ text: '   ' })).toThrow(
      BadRequestException,
    );
    expect(gapDetectorService.analyze).not.toHaveBeenCalled();
  });

  it('rejects announcements over the maximum length', () => {
    expect(() => controller.analyze({ text: 'a'.repeat(20_001) })).toThrow(
      PayloadTooLargeException,
    );
    expect(gapDetectorService.analyze).not.toHaveBeenCalled();
  });

  it('trims and forwards the announcement text', () => {
    const result = {
      missingInformation: [],
      ambiguities: [],
    };
    gapDetectorService.analyze.mockReturnValue(result);

    expect(controller.analyze({ text: '  Comunicado  ' })).toBe(result);
    expect(gapDetectorService.analyze).toHaveBeenCalledWith('Comunicado');
  });
});
