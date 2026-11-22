import {
  BadRequestException,
  Body,
  Controller,
  PayloadTooLargeException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { SimplifierService } from './simplifier.service';
import { SimplifierResult } from './simplifier.types';

const MAX_ANNOUNCEMENT_LENGTH = 20_000;

@Controller('simplifier')
@UseGuards(InstitutionApiKeyGuard)
export class SimplifierController {
  constructor(private readonly simplifierService: SimplifierService) {}

  @Post('simplify')
  simplify(@Body() body: unknown): Promise<SimplifierResult> {
    if (!isRecord(body) || typeof body['text'] !== 'string') {
      throw new BadRequestException('Request body must include a text string');
    }

    const text = body['text'].trim();
    if (!text) {
      throw new BadRequestException('text must not be empty');
    }

    if (text.length > MAX_ANNOUNCEMENT_LENGTH) {
      throw new PayloadTooLargeException(
        `text must not exceed ${MAX_ANNOUNCEMENT_LENGTH} characters`,
      );
    }

    return this.simplifierService.simplify(text);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
