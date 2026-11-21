import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommuniquesModule } from './modules/communiques/communiques.module';
import { GapDetectorModule } from './modules/gap-detector/gap-detector.module';
import { SimplifierModule } from './modules/simplifier/simplifier.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    CommuniquesModule,
    GapDetectorModule,
    SimplifierModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
