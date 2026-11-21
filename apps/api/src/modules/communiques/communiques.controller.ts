import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CommuniquesService } from './communiques.service';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MAX_OFFSET = 2_147_483_647;

@Controller('communiques')
export class CommuniquesController {
  constructor(private readonly communiquesService: CommuniquesService) {}

  @Get()
  list(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): ReturnType<CommuniquesService['listPublished']> {
    return this.communiquesService.listPublished({
      limit: parseInteger(limit, DEFAULT_LIMIT, 1, MAX_LIMIT, 'limit'),
      offset: parseInteger(offset, 0, 0, MAX_OFFSET, 'offset'),
    });
  }

  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    const communique = await this.communiquesService.findPublishedBySlug(slug);
    if (!communique) {
      throw new NotFoundException('Communique not found');
    }

    return communique;
  }
}

function parseInteger(
  value: string | undefined,
  defaultValue: number,
  minimum: number,
  maximum: number,
  field: string,
): number {
  if (value === undefined) {
    return defaultValue;
  }

  if (!/^\d+$/.test(value)) {
    throw new BadRequestException(
      `${field} must be an integer between ${minimum} and ${maximum}`,
    );
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new BadRequestException(
      `${field} must be an integer between ${minimum} and ${maximum}`,
    );
  }

  return parsed;
}
