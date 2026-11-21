import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { ClarificationsService } from './clarifications.service';
import {
  ClarificationStatus,
  CreateClarificationInput,
  UpdateClarificationInput,
} from './clarifications.types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const MAX_TITLE_LENGTH = 240;
const MAX_CONTENT_LENGTH = 5_000;
const VALID_STATUSES: readonly ClarificationStatus[] = [
  'DRAFT',
  'IN_REVIEW',
  'PUBLISHED',
];

@Controller('clarifications')
export class ClarificationsController {
  constructor(
    private readonly clarificationsService: ClarificationsService,
  ) {}

  @Get()
  @UseGuards(InstitutionApiKeyGuard)
  listForReview(@Query('status') status?: string) {
    return this.clarificationsService.listForReview(
      parseStatus(status),
    );
  }

  @Get('published')
  listPublished(@Query('communiqueId') communiqueId?: string) {
    return this.clarificationsService.listPublished(
      parseOptionalUuid(communiqueId, 'communiqueId'),
    );
  }

  @Post()
  @UseGuards(InstitutionApiKeyGuard)
  createDraft(@Body() body: unknown) {
    return this.clarificationsService.createDraft(parseCreateInput(body));
  }

  @Post('drafts/from-cluster')
  @UseGuards(InstitutionApiKeyGuard)
  createDraftFromCluster(@Body() body: unknown) {
    if (!isRecord(body)) {
      throw new BadRequestException('Request body must be an object');
    }
    const clusterId = parseRequiredUuid(body['clusterId'], 'clusterId');
    return this.clarificationsService.createDraftFromCluster(clusterId);
  }

  @Patch(':id')
  @UseGuards(InstitutionApiKeyGuard)
  updateDraft(
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const clarificationId = parseRequiredUuid(id, 'id');
    return this.clarificationsService.updateDraft(
      clarificationId,
      parseUpdateInput(body),
    );
  }

  @Post(':id/submit-for-review')
  @UseGuards(InstitutionApiKeyGuard)
  submitForReview(@Param('id') id: string) {
    return this.clarificationsService.submitForReview(
      parseRequiredUuid(id, 'id'),
    );
  }

  @Post(':id/publish')
  @UseGuards(InstitutionApiKeyGuard)
  publish(@Param('id') id: string) {
    return this.clarificationsService.publish(
      parseRequiredUuid(id, 'id'),
    );
  }
}

function parseCreateInput(body: unknown): CreateClarificationInput {
  if (!isRecord(body)) {
    throw new BadRequestException('Request body must be an object');
  }

  const title = parseText(body['title'], 'title', MAX_TITLE_LENGTH);
  const content = parseText(body['content'], 'content', MAX_CONTENT_LENGTH);
  const clusterId = parseOptionalUuid(body['clusterId'], 'clusterId');
  const communiqueId = parseOptionalUuid(
    body['communiqueId'],
    'communiqueId',
  );

  return {
    title,
    content,
    ...(clusterId ? { clusterId } : {}),
    ...(communiqueId ? { communiqueId } : {}),
  };
}

function parseUpdateInput(body: unknown): UpdateClarificationInput {
  if (!isRecord(body)) {
    throw new BadRequestException('Request body must be an object');
  }

  const input: UpdateClarificationInput = {};
  if (body['title'] !== undefined) {
    input.title = parseText(body['title'], 'title', MAX_TITLE_LENGTH);
  }
  if (body['content'] !== undefined) {
    input.content = parseText(
      body['content'],
      'content',
      MAX_CONTENT_LENGTH,
    );
  }
  if (Object.keys(input).length === 0) {
    throw new BadRequestException(
      'Request body must include a title or content to update',
    );
  }
  return input;
}

function parseText(value: unknown, field: string, maximum: number): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new BadRequestException(`${field} must be a non-empty string`);
  }
  const text = value.trim();
  if (text.length > maximum) {
    throw new BadRequestException(
      `${field} must not exceed ${maximum} characters`,
    );
  }
  return text;
}

function parseStatus(value: string | undefined): ClarificationStatus | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (!isClarificationStatus(value)) {
    throw new BadRequestException(
      'status must be DRAFT, IN_REVIEW, or PUBLISHED',
    );
  }
  return value;
}

function isClarificationStatus(value: string): value is ClarificationStatus {
  return VALID_STATUSES.some((status) => status === value);
}

function parseRequiredUuid(value: unknown, field: string): string {
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    throw new BadRequestException(`${field} must be a valid UUID`);
  }
  return value;
}

function parseOptionalUuid(
  value: unknown,
  field: string,
): string | undefined {
  return value === undefined ? undefined : parseRequiredUuid(value, field);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
