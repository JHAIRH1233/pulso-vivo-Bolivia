import { Module } from '@nestjs/common';
import { AiModule } from '../../shared/ai/ai.module';
import { GapDetectorController } from './gap-detector.controller';
import { GapDetectorService } from './gap-detector.service';

@Module({
  imports: [AiModule],
  controllers: [GapDetectorController],
  providers: [GapDetectorService],
})
export class GapDetectorModule {}
