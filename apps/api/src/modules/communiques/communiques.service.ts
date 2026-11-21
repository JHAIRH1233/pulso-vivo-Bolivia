import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

export interface CommuniquePage {
  data: Awaited<ReturnType<CommuniquesService['selectPublished']>>;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

@Injectable()
export class CommuniquesService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublished({
    limit,
    offset,
  }: {
    limit: number;
    offset: number;
  }): Promise<CommuniquePage> {
    const where = { status: 'PUBLISHED' as const };
    const [data, total] = await Promise.all([
      this.selectPublished(where, limit, offset),
      this.prisma.client.communique.count({ where }),
    ]);

    return {
      data,
      pagination: { limit, offset, total },
    };
  }

  async findPublishedBySlug(slug: string) {
    return this.prisma.client.communique.findFirst({
      where: { slug, status: 'PUBLISHED' },
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        simplifiedContent: true,
        language: true,
        publishedAt: true,
        translations: {
          orderBy: { language: 'asc' },
          select: {
            language: true,
            title: true,
            content: true,
            audioUrl: true,
          },
        },
      },
    });
  }

  private selectPublished(
    where: { status: 'PUBLISHED' },
    limit: number,
    offset: number,
  ) {
    return this.prisma.client.communique.findMany({
      where,
      orderBy: [
        { publishedAt: { sort: 'desc', nulls: 'last' } },
        { id: 'desc' },
      ],
      skip: offset,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        simplifiedContent: true,
        language: true,
        publishedAt: true,
      },
    });
  }
}
