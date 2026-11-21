import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GapDetectorModule } from './modules/gap-detector/gap-detector.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    GapDetectorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
