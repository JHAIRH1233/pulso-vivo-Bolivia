import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { InstitutionApiKeyGuard } from '../../shared/security/institution-api-key.guard';
import { SimplifierController } from './simplifier.controller';
import { SimplifierService } from './simplifier.service';

@Module({
  imports: [AiModule],
  controllers: [SimplifierController],
  providers: [SimplifierService, InstitutionApiKeyGuard],
})
export class SimplifierModule {}
