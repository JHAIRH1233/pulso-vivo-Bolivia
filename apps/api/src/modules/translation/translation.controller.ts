import {
  BadRequestException,
  Body,
  Controller,
  PayloadTooLargeException,
  Post,
} from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationResult } from './translation.types';

const MAX_ANNOUNCEMENT_LENGTH = 20_000;

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post('to-quechua')
  translate(@Body() body: unknown): Promise<TranslationResult> {
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

    return this.translationService.translateToQuechua(text);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
