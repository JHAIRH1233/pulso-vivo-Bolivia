import {
  BadRequestException,
  Body,
  Controller,
  PayloadTooLargeException,
  Post,
} from '@nestjs/common';
import { AssistantAnswer, AssistantService } from './assistant.service';

const MAX_QUESTION_LENGTH = 2_000;
const MAX_COMMUNIQUE_SLUG_LENGTH = 180;

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('answer')
  answer(@Body() body: unknown): Promise<AssistantAnswer> {
    if (!isRecord(body) || typeof body['question'] !== 'string') {
      throw new BadRequestException(
        'Request body must include a question string',
      );
    }

    const question = body['question'].trim();
    if (!question) {
      throw new BadRequestException('question must not be empty');
    }

    if (question.length > MAX_QUESTION_LENGTH) {
      throw new PayloadTooLargeException(
        `question must not exceed ${MAX_QUESTION_LENGTH} characters`,
      );
    }

    if (typeof body['communiqueSlug'] !== 'string') {
      throw new BadRequestException(
        'Request body must include a communiqueSlug string',
      );
    }

    const communiqueSlug = body['communiqueSlug'].trim();
    if (!communiqueSlug) {
      throw new BadRequestException('communiqueSlug must not be empty');
    }

    if (communiqueSlug.length > MAX_COMMUNIQUE_SLUG_LENGTH) {
      throw new PayloadTooLargeException(
        `communiqueSlug must not exceed ${MAX_COMMUNIQUE_SLUG_LENGTH} characters`,
      );
    }

    return this.assistantService.answer(question, communiqueSlug);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
