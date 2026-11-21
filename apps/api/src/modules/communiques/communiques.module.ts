import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { CommuniquesController } from './communiques.controller';
import { CommuniquesService } from './communiques.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CommuniquesController],
  providers: [CommuniquesService],
})
export class CommuniquesModule {}
