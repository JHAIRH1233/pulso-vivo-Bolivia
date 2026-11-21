import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { GapDetectorController } from './gap-detector.controller';
import { GapDetectorService } from './gap-detector.service';

@Module({
  imports: [AiModule],
  controllers: [GapDetectorController],
  providers: [GapDetectorService, InstitutionApiKeyGuard],
})
export class GapDetectorModule {}
