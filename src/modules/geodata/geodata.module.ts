import { Module } from '@nestjs/common';
import { GeodataService } from './geodata.service';
import { GeodataController } from './geodata.controller';
import { GeoData } from './models/geodata.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([GeoData])],
  providers: [GeodataService],
  controllers: [GeodataController],
})
export class GeodataModule {}
