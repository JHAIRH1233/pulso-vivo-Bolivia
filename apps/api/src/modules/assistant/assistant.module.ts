import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { CommuniquesModule } from '../communiques/communiques.module';
import { AssistantController } from './assistant.controller';
import { AssistantService } from './assistant.service';

@Module({
  imports: [AiModule, CommuniquesModule],
  controllers: [AssistantController],
  providers: [AssistantService],
})
export class AssistantModule {}
