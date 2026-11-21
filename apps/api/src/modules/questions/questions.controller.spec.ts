import {
  BadRequestException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

describe('QuestionsController', () => {
  const questionsService = {
    submit: jest.fn(),
  };
  let controller: QuestionsController;

  beforeEach(async () => {
    questionsService.submit.mockReset();
    const module = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [{ provide: QuestionsService, useValue: questionsService }],
    }).compile();

    controller = module.get(QuestionsController);
  });

  it('trims text and defaults the language to Spanish', () => {
    const response = { id: 'question-id', status: 'PENDING' };
    questionsService.submit.mockReturnValue(response);

    expect(controller.submit({ text: '  ¿Cuándo inicia?  ' })).toBe(response);
    expect(questionsService.submit).toHaveBeenCalledWith({
      text: '¿Cuándo inicia?',
      language: 'ES',
    });
  });

  it('accepts a supported language and a valid communique UUID', () => {
    const communiqueId = 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc';
    questionsService.submit.mockReturnValue({});

    controller.submit({
      text: '¿Dónde será?',
      language: 'QU',
      communiqueId,
    });

    expect(questionsService.submit).toHaveBeenCalledWith({
      text: '¿Dónde será?',
      language: 'QU',
      communiqueId,
    });
  });

  it('rejects missing, blank, and oversized questions', () => {
    expect(() => controller.submit({})).toThrow(BadRequestException);
    expect(() => controller.submit({ text: '   ' })).toThrow(
      BadRequestException,
    );
    expect(() => controller.submit({ text: 'a'.repeat(2_001) })).toThrow(
      PayloadTooLargeException,
    );
    expect(questionsService.submit).not.toHaveBeenCalled();
  });

  it('rejects unsupported languages and malformed communique IDs', () => {
    expect(() =>
      controller.submit({ text: 'Pregunta', language: 'EN' }),
    ).toThrow(BadRequestException);
    expect(() =>
      controller.submit({ text: 'Pregunta', communiqueId: 'not-a-uuid' }),
    ).toThrow(BadRequestException);
    expect(questionsService.submit).not.toHaveBeenCalled();
  });
});
