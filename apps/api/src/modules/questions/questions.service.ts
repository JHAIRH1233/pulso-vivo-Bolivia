import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

export interface SubmitQuestionInput {
  text: string;
  language: 'ES' | 'QU';
  communiqueId?: string;
}

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(input: SubmitQuestionInput) {
    if (input.communiqueId) {
      const communique = await this.prisma.client.communique.findFirst({
        where: {
          id: input.communiqueId,
          status: 'PUBLISHED',
        },
        select: { id: true },
      });

      if (!communique) {
        throw new NotFoundException('Published communique not found');
      }
    }

    return this.prisma.client.question.create({
      data: {
        text: input.text,
        language: input.language,
        communiqueId: input.communiqueId ?? null,
      },
      select: {
        id: true,
        communiqueId: true,
        text: true,
        language: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
