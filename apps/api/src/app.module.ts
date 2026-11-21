import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioModule } from './modules/audio/audio.module';
import { CommuniquesModule } from './modules/communiques/communiques.module';
import { GapDetectorModule } from './modules/gap-detector/gap-detector.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TranslationModule } from './modules/translation/translation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    AudioModule,
    CommuniquesModule,
    GapDetectorModule,
    QuestionsModule,
    TranslationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
