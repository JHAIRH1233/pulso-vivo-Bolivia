import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssistantModule } from './modules/assistant/assistant.module';
import { AudioModule } from './modules/audio/audio.module';
import { CommuniquesModule } from './modules/communiques/communiques.module';
import { ConfusionRadarModule } from './modules/confusion-radar/confusion-radar.module';
import { ClarificationsModule } from './modules/clarifications/clarifications.module';
import { GapDetectorModule } from './modules/gap-detector/gap-detector.module';
import { SimplifierModule } from './modules/simplifier/simplifier.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TranslationModule } from './modules/translation/translation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    AssistantModule,
    AudioModule,
    CommuniquesModule,
    ConfusionRadarModule,
    ClarificationsModule,
    GapDetectorModule,
    SimplifierModule,
    QuestionsModule,
    TranslationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
