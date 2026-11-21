import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../shared/database/prisma.service';
import { QuestionsService } from './questions.service';

describe('QuestionsService', () => {
  const communique = {
    findFirst: jest.fn(),
  };
  const question = {
    create: jest.fn(),
  };
  let service: QuestionsService;

  beforeEach(async () => {
    communique.findFirst.mockReset();
    question.create.mockReset();
    const module = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: { client: { communique, question } },
        },
      ],
    }).compile();

    service = module.get(QuestionsService);
  });

  it('stores questions as pending and links only to published communiques', async () => {
    const communiqueId = 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc';
    communique.findFirst.mockResolvedValue({ id: communiqueId });
    const savedQuestion = { id: 'question-id', status: 'PENDING' };
    question.create.mockResolvedValue(savedQuestion);

    await expect(
      service.submit({
        text: '¿Cuándo inicia?',
        language: 'ES',
        communiqueId,
      }),
    ).resolves.toBe(savedQuestion);

    expect(communique.findFirst).toHaveBeenCalledWith({
      where: { id: communiqueId, status: 'PUBLISHED' },
      select: { id: true },
    });
    expect(question.create).toHaveBeenCalledWith({
      data: {
        text: '¿Cuándo inicia?',
        language: 'ES',
        communiqueId,
      },
      select: expect.objectContaining({
        id: true,
        status: true,
        text: true,
      }),
    });
  });

  it('rejects links to missing or unpublished communiques', async () => {
    communique.findFirst.mockResolvedValue(null);

    await expect(
      service.submit({
        text: '¿Cuándo inicia?',
        language: 'ES',
        communiqueId: 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(question.create).not.toHaveBeenCalled();
  });

  it('allows questions not associated with a communique', async () => {
    const savedQuestion = { id: 'question-id', status: 'PENDING' };
    question.create.mockResolvedValue(savedQuestion);

    await expect(
      service.submit({ text: 'Pregunta general', language: 'QU' }),
    ).resolves.toBe(savedQuestion);
    expect(communique.findFirst).not.toHaveBeenCalled();
    expect(question.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          text: 'Pregunta general',
          language: 'QU',
          communiqueId: null,
        },
      }),
    );
  });
});
