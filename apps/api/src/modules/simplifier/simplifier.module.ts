import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { SimplifierController } from './simplifier.controller';
import { SimplifierService } from './simplifier.service';

@Module({
  imports: [AiModule],
  controllers: [SimplifierController],
  providers: [SimplifierService],
})
export class SimplifierModule {}
