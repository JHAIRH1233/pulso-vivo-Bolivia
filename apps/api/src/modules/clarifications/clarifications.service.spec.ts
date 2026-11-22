import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LlmClient } from '../../shared/ai/llm.client';
import { PrismaService } from '../../shared/database/prisma.service';
import { ClarificationsService } from './clarifications.service';

describe('ClarificationsService', () => {
  let service: ClarificationsService;
  const clarification = {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  };
  const confusionCluster = { findUnique: jest.fn() };
  const communique = { findFirst: jest.fn() };
  const prismaService = {
    client: { clarification, confusionCluster, communique },
  };
  const llmClient = {
    completeJson: jest.fn<Promise<string>, [string, string]>(),
  };

  beforeEach(async () => {
    Object.values(clarification).forEach((mock) => mock.mockReset());
    confusionCluster.findUnique.mockReset();
    communique.findFirst.mockReset();
    llmClient.completeJson.mockReset();

    const module = await Test.createTestingModule({
      providers: [
        ClarificationsService,
        { provide: PrismaService, useValue: prismaService },
        { provide: LlmClient, useValue: llmClient },
      ],
    }).compile();

    service = module.get(ClarificationsService);
  });

  it('creates an unpublished draft from cluster summary and published source', async () => {
    const clusterId = 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc';
    const communiqueId = '6947361a-74f9-4ad9-b242-021de8f51e11';
    const cluster = {
      id: clusterId,
      title: 'Lugar de la jornada',
      summary: 'Las preguntas piden conocer el lugar.',
      communiqueId,
    };
    confusionCluster.findUnique.mockResolvedValue(cluster);
    communique.findFirst.mockResolvedValue({
      id: communiqueId,
      title: 'Jornada de salud',
      content: 'La jornada se realizará en el centro municipal.',
    });
    llmClient.completeJson.mockResolvedValue(
      JSON.stringify({
        title: 'Lugar de la jornada',
        content: 'La jornada se realizará en el centro municipal.',
      }),
    );
    const draft = { id: 'draft-1', status: 'DRAFT' };
    clarification.create.mockResolvedValue(draft);

    await expect(service.createDraftFromCluster(clusterId)).resolves.toBe(
      draft,
    );
    expect(llmClient.completeJson).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(cluster.summary),
    );
    expect(clarification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clusterId,
          communiqueId,
          title: 'Lugar de la jornada',
        }),
      }),
    );
  });

  it('does not generate a draft when the cluster has no linked communiqué', async () => {
    confusionCluster.findUnique.mockResolvedValue({
      id: 'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc',
      communiqueId: null,
    });

    await expect(
      service.createDraftFromCluster(
        'c3b4ea76-68f0-4d4a-a9fc-cd07848445bc',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(llmClient.completeJson).not.toHaveBeenCalled();
    expect(clarification.create).not.toHaveBeenCalled();
  });

  it('filters public results to published clarifications', async () => {
    clarification.findMany.mockResolvedValue([]);

    await service.listPublished();

    expect(clarification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'PUBLISHED' } }),
    );
  });

  it('prevents editing clarifications after they enter review', async () => {
    clarification.findUnique.mockResolvedValue({ status: 'IN_REVIEW' });

    await expect(
      service.updateDraft('clarification-1', { title: 'Updated title' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(clarification.update).not.toHaveBeenCalled();
  });

  it('only publishes clarifications that are in review', async () => {
    clarification.updateMany.mockResolvedValue({ count: 0 });
    clarification.findUnique.mockResolvedValue({ status: 'DRAFT' });

    await expect(service.publish('clarification-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(clarification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'clarification-1', status: 'IN_REVIEW' },
      }),
    );
  });

  it('moves a draft through review before publishing it', async () => {
    clarification.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 1 });
    clarification.findUnique
      .mockResolvedValueOnce({ id: 'clarification-1', status: 'IN_REVIEW' })
      .mockResolvedValueOnce({ id: 'clarification-1', status: 'PUBLISHED' });

    await expect(
      service.submitForReview('clarification-1'),
    ).resolves.toMatchObject({ status: 'IN_REVIEW' });
    await expect(service.publish('clarification-1')).resolves.toMatchObject({
      status: 'PUBLISHED',
    });
    expect(clarification.updateMany).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: 'clarification-1', status: 'DRAFT' },
        data: { status: 'IN_REVIEW' },
      }),
    );
    expect(clarification.updateMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { id: 'clarification-1', status: 'IN_REVIEW' },
        data: expect.objectContaining({ status: 'PUBLISHED' }),
      }),
    );
  });
});
