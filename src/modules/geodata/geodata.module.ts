import { Module } from '@nestjs/common';
import { GeodataService } from './geodata.service';
import { GeodataController } from './geodata.controller';

@Module({
  providers: [GeodataService],
  controllers: [GeodataController],
})
export class GeodataModule {}
