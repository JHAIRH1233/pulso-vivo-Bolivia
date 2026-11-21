import {
  BadRequestException,
  Body,
  Controller,
  PayloadTooLargeException,
  Post,
} from '@nestjs/common';
import { AudioService } from './audio.service';
import { SpeechAudioResult } from './audio.types';

const MAX_SPEECH_LENGTH = 4_000;

@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('synthesize')
  synthesize(@Body() body: unknown): Promise<SpeechAudioResult> {
    if (!isRecord(body) || typeof body['text'] !== 'string') {
      throw new BadRequestException('Request body must include a text string');
    }

    const text = body['text'].trim();
    if (!text) {
      throw new BadRequestException('text must not be empty');
    }

    if (text.length > MAX_SPEECH_LENGTH) {
      throw new PayloadTooLargeException(
        `text must not exceed ${MAX_SPEECH_LENGTH} characters`,
      );
    }

    return this.audioService.synthesize(text);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
