import {
  BadRequestException,
  Body,
  Controller,
  PayloadTooLargeException,
  Post,
} from '@nestjs/common';
import { GapDetectorService } from './gap-detector.service';
import { GapDetectorResult } from './gap-detector.types';

const MAX_ANNOUNCEMENT_LENGTH = 20_000;

@Controller('gap-detector')
export class GapDetectorController {
  constructor(private readonly gapDetectorService: GapDetectorService) {}

  @Post('analyze')
  analyze(@Body() body: unknown): Promise<GapDetectorResult> {
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

    return this.gapDetectorService.analyze(text);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
