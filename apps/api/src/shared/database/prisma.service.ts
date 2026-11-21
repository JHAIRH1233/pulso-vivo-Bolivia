import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma-client/client';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  private prismaClient: PrismaClient | undefined;

  constructor(private readonly configService: ConfigService) {}

  get client(): PrismaClient {
    if (!this.prismaClient) {
      const connectionString =
        this.configService.getOrThrow<string>('DATABASE_URL');
      this.prismaClient = new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
      });
    }

    return this.prismaClient;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.prismaClient) {
      await this.prismaClient.$disconnect();
    }
  }
}
