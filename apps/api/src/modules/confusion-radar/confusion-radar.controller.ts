import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { ConfusionRadarService } from './confusion-radar.service';
import { AnalyzeConfusionResult, ConfusionRadarCluster } from './confusion-radar.types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

@Controller('confusion-radar')
@UseGuards(InstitutionApiKeyGuard)
export class ConfusionRadarController {
  constructor(private readonly confusionRadarService: ConfusionRadarService) {}

  @Post('analyze')
  analyze(
    @Body() body: unknown,
  ): Promise<AnalyzeConfusionResult> {
    if (!isRecord(body)) {
      throw new BadRequestException('Request body must be an object');
    }

    const communiqueId = parseOptionalCommuniqueId(body['communiqueId']);
    return this.confusionRadarService.analyze(communiqueId);
  }

  @Get('clusters')
  list(
    @Query('communiqueId') communiqueId?: string,
  ): Promise<ConfusionRadarCluster[]> {
    const parsedCommuniqueId = parseOptionalCommuniqueId(communiqueId);
    return this.confusionRadarService.listClusters(parsedCommuniqueId);
  }
}

function parseOptionalCommuniqueId(value: unknown): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) {
    throw new BadRequestException('communiqueId must be a valid UUID');
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
