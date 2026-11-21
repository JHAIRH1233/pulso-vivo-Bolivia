import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

describe('AssistantController', () => {
  const assistantService = {
    answer: jest.fn(),
  };
  let controller: AssistantController;

  beforeEach(async () => {
    assistantService.answer.mockReset();
    const module = await Test.createTestingModule({
      controllers: [AssistantController],
      providers: [{ provide: AssistantService, useValue: assistantService }],
    }).compile();

    controller = module.get(AssistantController);
  });

  it('rejects missing and blank questions or communiqué slugs', () => {
    expect(() => controller.answer({ communiqueSlug: 'aviso' })).toThrow(
      BadRequestException,
    );
    expect(
      () => controller.answer({ question: '  ', communiqueSlug: 'aviso' }),
    ).toThrow(BadRequestException);
    expect(() => controller.answer({ question: '¿Cuándo?' })).toThrow(
      BadRequestException,
    );
    expect(
      () =>
        controller.answer({
          question: '¿Cuándo?',
          communiqueSlug: '  ',
        }),
    ).toThrow(BadRequestException);
    expect(assistantService.answer).not.toHaveBeenCalled();
  });

  it('rejects questions and slugs over their maximum lengths', () => {
    expect(
      () =>
        controller.answer({
          question: 'a'.repeat(2_001),
          communiqueSlug: 'aviso',
        }),
    ).toThrow(PayloadTooLargeException);
    expect(
      () =>
        controller.answer({
          question: '¿Cuándo?',
          communiqueSlug: 'a'.repeat(181),
        }),
    ).toThrow(PayloadTooLargeException);
    expect(assistantService.answer).not.toHaveBeenCalled();
  });

  it('trims and forwards the question and published communiqué slug', () => {
    const result = {
      answer: 'El comunicado indica que será el jueves.',
      evidence: 'el jueves',
      communique: { slug: 'aviso', title: 'Aviso' },
    };
    assistantService.answer.mockResolvedValue(result);

    expect(
      controller.answer({
        question: '  ¿Cuándo será?  ',
        communiqueSlug: '  aviso  ',
      }),
    ).toEqual(expect.any(Promise));
    expect(assistantService.answer).toHaveBeenCalledWith(
      '¿Cuándo será?',
      'aviso',
    );
  });
});
