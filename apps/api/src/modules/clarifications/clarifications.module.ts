import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { DatabaseModule } from '../../shared/database/database.module';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { ClarificationsController } from './clarifications.controller';
import { ClarificationsService } from './clarifications.service';

@Module({
  imports: [AiModule, DatabaseModule],
  controllers: [ClarificationsController],
  providers: [ClarificationsService, InstitutionApiKeyGuard],
})
export class ClarificationsModule {}
