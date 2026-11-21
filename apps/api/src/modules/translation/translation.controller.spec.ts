import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';

describe('TranslationController', () => {
  const translationService = {
    translateToQuechua: jest.fn(),
  };
  let controller: TranslationController;

  beforeEach(async () => {
    translationService.translateToQuechua.mockReset();
    const module = await Test.createTestingModule({
      controllers: [TranslationController],
      providers: [
        { provide: TranslationService, useValue: translationService },
      ],
    }).compile();

    controller = module.get(TranslationController);
  });

  it('rejects missing, non-string, and blank text', () => {
    expect(() => controller.translate({})).toThrow(BadRequestException);
    expect(() => controller.translate({ text: 42 })).toThrow(
      BadRequestException,
    );
    expect(() => controller.translate({ text: '   ' })).toThrow(
      BadRequestException,
    );
    expect(translationService.translateToQuechua).not.toHaveBeenCalled();
  });

  it('rejects announcements over the maximum length', () => {
    expect(() => controller.translate({ text: 'a'.repeat(20_001) })).toThrow(
      PayloadTooLargeException,
    );
    expect(translationService.translateToQuechua).not.toHaveBeenCalled();
  });

  it('trims and forwards the announcement text', () => {
    const result = { translatedText: 'Quechua translation' };
    translationService.translateToQuechua.mockReturnValue(result);

    expect(controller.translate({ text: '  Comunicado  ' })).toBe(result);
    expect(translationService.translateToQuechua).toHaveBeenCalledWith(
      'Comunicado',
    );
  });
});
