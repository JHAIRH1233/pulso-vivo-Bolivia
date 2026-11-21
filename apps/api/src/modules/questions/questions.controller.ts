import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  PayloadTooLargeException,
  Post,
} from '@nestjs/common';
import { QuestionsService, SubmitQuestionInput } from './questions.service';

const MAX_QUESTION_LENGTH = 2_000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  submit(@Body() body: unknown) {
    const input = parseSubmission(body);
    return this.questionsService.submit(input);
  }
}

function parseSubmission(body: unknown): SubmitQuestionInput {
  if (!isRecord(body) || typeof body['text'] !== 'string') {
    throw new BadRequestException('Request body must include a text string');
  }

  const text = body['text'].trim();
  if (!text) {
    throw new BadRequestException('text must not be empty');
  }

  if (text.length > MAX_QUESTION_LENGTH) {
    throw new PayloadTooLargeException(
      `text must not exceed ${MAX_QUESTION_LENGTH} characters`,
    );
  }

  const language = body['language'] === undefined ? 'ES' : body['language'];
  if (language !== 'ES' && language !== 'QU') {
    throw new BadRequestException('language must be ES or QU');
  }

  const communiqueId = body['communiqueId'];
  if (
    communiqueId !== undefined &&
    (typeof communiqueId !== 'string' || !UUID_PATTERN.test(communiqueId))
  ) {
    throw new BadRequestException('communiqueId must be a valid UUID');
  }

  return {
    text,
    language,
    ...(typeof communiqueId === 'string' ? { communiqueId } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
