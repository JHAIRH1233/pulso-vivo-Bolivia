import { BadGatewayException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LlmClient } from '../../shared/ai/llm.client';
import { PrismaService } from '../../shared/database/prisma.service';
import { ConfusionRadarService } from './confusion-radar.service';

describe('ConfusionRadarService', () => {
  let service: ConfusionRadarService;
  const questions = {
    findMany: jest.fn(),
  };
  const clusters = {
    findMany: jest.fn(),
  };
  const transactionQuestions = {
    updateMany: jest.fn(),
    count: jest.fn(),
  };
  const transactionClusters = {
    findMany: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };
  const transaction = {
    question: transactionQuestions,
    confusionCluster: transactionClusters,
  };
  const prismaClient = {
    question: questions,
    confusionCluster: clusters,
    $transaction: jest.fn(),
  };
  const prismaService = { client: prismaClient };
  const llmClient = {
    completeJson: jest.fn<Promise<string>, [string, string]>(),
  };

  beforeEach(async () => {
    questions.findMany.mockReset();
    clusters.findMany.mockReset();
    transactionQuestions.updateMany.mockReset();
    transactionQuestions.count.mockReset();
    transactionClusters.findMany.mockReset();
    transactionClusters.delete.mockReset();
    transactionClusters.create.mockReset();
    prismaClient.$transaction.mockReset();
    prismaClient.$transaction.mockImplementation((callback) =>
      callback(transaction),
    );
    llmClient.completeJson.mockReset();

    const module = await Test.createTestingModule({
      providers: [
        ConfusionRadarService,
        { provide: PrismaService, useValue: prismaService },
        { provide: LlmClient, useValue: llmClient },
      ],
    }).compile();

    service = module.get(ConfusionRadarService);
  });

  it('groups only supplied question IDs and persists the cluster', async () => {
    const communiqueId = 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc';
    const pendingQuestions = [
      {
        id: 'question-1',
        text: '¿Dónde será la jornada?',
        language: 'ES',
        communiqueId,
      },
      {
        id: 'question-2',
        text: '¿En qué lugar se realizará?',
        language: 'ES',
        communiqueId,
      },
    ];
    questions.findMany.mockResolvedValue(pendingQuestions);
    llmClient.completeJson.mockResolvedValue(
      JSON.stringify({
        clusters: [
          {
            title: 'Lugar de la jornada',
            summary: 'Las personas preguntan dónde se realizará la jornada.',
            questionIds: ['question-1', 'question-2'],
          },
        ],
      }),
    );
    transactionClusters.findMany.mockResolvedValue([]);
    transactionQuestions.updateMany.mockResolvedValue({ count: 2 });
    const updatedAt = new Date('2026-11-21T12:00:00Z');
    transactionClusters.create.mockResolvedValue({
      id: 'cluster-1',
      communiqueId,
      title: 'Lugar de la jornada',
      summary: 'Las personas preguntan dónde se realizará la jornada.',
      status: 'ACTIVE',
      updatedAt,
      _count: { questions: 2 },
    });

    await expect(service.analyze(communiqueId)).resolves.toEqual({
      analyzedQuestionCount: 2,
      clusters: [
        {
          id: 'cluster-1',
          communiqueId,
          title: 'Lugar de la jornada',
          summary: 'Las personas preguntan dónde se realizará la jornada.',
          status: 'ACTIVE',
          updatedAt,
          questionCount: 2,
        },
      ],
    });
    expect(questions.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'PENDING', communiqueId },
        take: 100,
      }),
    );
    expect(transactionClusters.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          communiqueId,
          questions: {
            connect: [{ id: 'question-1' }, { id: 'question-2' }],
          },
        }),
      }),
    );
  });

  it('rejects clusters containing unknown question IDs', async () => {
    questions.findMany.mockResolvedValue([
      {
        id: 'question-1',
        text: '¿Dónde será?',
        language: 'ES',
        communiqueId: null,
      },
      {
        id: 'question-2',
        text: '¿En qué lugar?',
        language: 'ES',
        communiqueId: null,
      },
    ]);
    llmClient.completeJson.mockResolvedValue(
      JSON.stringify({
        clusters: [
          {
            title: 'Lugar',
            summary: 'Preguntas sobre el lugar.',
            questionIds: ['question-1', 'unknown-question'],
          },
        ],
      }),
    );

    await expect(service.analyze()).rejects.toBeInstanceOf(
      BadGatewayException,
    );
    expect(prismaClient.$transaction).not.toHaveBeenCalled();
  });

  it('clears stale groups without calling the LLM for a single question', async () => {
    questions.findMany.mockResolvedValue([
      {
        id: 'question-1',
        text: '¿Dónde será?',
        language: 'ES',
        communiqueId: null,
      },
    ]);
    transactionClusters.findMany.mockResolvedValue([]);
    transactionQuestions.updateMany.mockResolvedValue({ count: 1 });

    await expect(service.analyze()).resolves.toEqual({
      analyzedQuestionCount: 1,
      clusters: [],
    });
    expect(llmClient.completeJson).not.toHaveBeenCalled();
    expect(transactionQuestions.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ['question-1'] } },
      data: { clusterId: null },
    });
  });

  it('lists active clusters without returning question text', async () => {
    const updatedAt = new Date('2026-11-21T12:00:00Z');
    clusters.findMany.mockResolvedValue([
      {
        id: 'cluster-1',
        communiqueId: null,
        title: 'Lugar',
        summary: 'Preguntas sobre el lugar.',
        status: 'ACTIVE',
        updatedAt,
        _count: { questions: 3 },
      },
    ]);

    await expect(service.listClusters()).resolves.toEqual([
      {
        id: 'cluster-1',
        communiqueId: null,
        title: 'Lugar',
        summary: 'Preguntas sobre el lugar.',
        status: 'ACTIVE',
        updatedAt,
        questionCount: 3,
      },
    ]);
    expect(clusters.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'ACTIVE' },
        select: expect.objectContaining({ _count: { select: { questions: true } } }),
      }),
    );
  });
});
