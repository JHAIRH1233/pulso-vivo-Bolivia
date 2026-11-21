import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

describe('AudioController', () => {
  const audioService = {
    synthesize: jest.fn(),
  };
  let controller: AudioController;

  beforeEach(async () => {
    audioService.synthesize.mockReset();
    const module = await Test.createTestingModule({
      controllers: [AudioController],
      providers: [{ provide: AudioService, useValue: audioService }],
    }).compile();

    controller = module.get(AudioController);
  });

  it('rejects missing, non-string, and blank text', () => {
    expect(() => controller.synthesize({})).toThrow(BadRequestException);
    expect(() => controller.synthesize({ text: 42 })).toThrow(
      BadRequestException,
    );
    expect(() => controller.synthesize({ text: '   ' })).toThrow(
      BadRequestException,
    );
    expect(audioService.synthesize).not.toHaveBeenCalled();
  });

  it('rejects text over the maximum speech length', () => {
    expect(() => controller.synthesize({ text: 'a'.repeat(4_001) })).toThrow(
      PayloadTooLargeException,
    );
    expect(audioService.synthesize).not.toHaveBeenCalled();
  });

  it('trims and forwards text to the audio service', () => {
    const result = { audioBase64: 'aWQz', mimeType: 'audio/mpeg' as const };
    audioService.synthesize.mockReturnValue(result);

    expect(controller.synthesize({ text: '  Texto en quechua  ' })).toBe(result);
    expect(audioService.synthesize).toHaveBeenCalledWith('Texto en quechua');
  });
});
