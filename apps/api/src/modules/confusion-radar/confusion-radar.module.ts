import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { DatabaseModule } from '../../shared/database/database.module';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { ConfusionRadarController } from './confusion-radar.controller';
import { ConfusionRadarService } from './confusion-radar.service';

@Module({
  imports: [AiModule, DatabaseModule],
  controllers: [ConfusionRadarController],
  providers: [ConfusionRadarService, InstitutionApiKeyGuard],
  exports: [ConfusionRadarService],
})
export class ConfusionRadarModule {}
