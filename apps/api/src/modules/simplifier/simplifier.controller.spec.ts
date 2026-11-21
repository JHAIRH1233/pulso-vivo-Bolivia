import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { SimplifierController } from './simplifier.controller';
import { SimplifierService } from './simplifier.service';

describe('SimplifierController', () => {
  const simplifierService = {
    simplify: jest.fn(),
  };
  let controller: SimplifierController;

  beforeEach(async () => {
    simplifierService.simplify.mockReset();
    const module = await Test.createTestingModule({
      controllers: [SimplifierController],
      providers: [{ provide: SimplifierService, useValue: simplifierService }],
    }).compile();

    controller = module.get(SimplifierController);
  });

  it('rejects missing, non-string, and blank text', () => {
    expect(() => controller.simplify({})).toThrow(BadRequestException);
    expect(() => controller.simplify({ text: 42 })).toThrow(
      BadRequestException,
    );
    expect(() => controller.simplify({ text: '   ' })).toThrow(
      BadRequestException,
    );
    expect(simplifierService.simplify).not.toHaveBeenCalled();
  });

  it('rejects announcements over the maximum length', () => {
    expect(() => controller.simplify({ text: 'a'.repeat(20_001) })).toThrow(
      PayloadTooLargeException,
    );
    expect(simplifierService.simplify).not.toHaveBeenCalled();
  });

  it('trims and forwards the announcement text', () => {
    const result = { simplifiedText: 'Texto claro.' };
    simplifierService.simplify.mockReturnValue(result);

    expect(controller.simplify({ text: '  Texto oficial.  ' })).toBe(result);
    expect(simplifierService.simplify).toHaveBeenCalledWith('Texto oficial.');
  });
});
