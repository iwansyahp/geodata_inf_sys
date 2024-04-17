import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GeoData } from './models/geodata.model';

import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { UploadedFileDto } from './dto/uploaded.file.dto';

@Injectable()
export class GeodataService {
  constructor(
    private configService: ConfigService,
    @InjectModel(GeoData) private geoDataModel: typeof GeoData,
  ) {}

  async processGeoJsonData(file: UploadedFileDto): Promise<GeoData> {
    // Error handling array
    const errors = [];

    // Save file
    const fileName = Date.now() + '-' + file.originalname;
    const uploadLocation = path.join(
      this.configService.get<string>('upload_folder'),
      fileName,
    );
    try {
      fs.writeFileSync(uploadLocation, file.buffer);
    } catch (error) {
      // Error occurred during file handling
      fs.unlinkSync(uploadLocation); // Remove the file
      errors.push({ filename: file.originalname, error: error.message });
    }

    // Check if any errors occurred
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'File could not be processed',
        errors,
      });
    }

    // only store to Database if only files stored in file sytem
    const geodata = {
      file_name: fileName,
      data: JSON.parse(file.buffer.toString('utf-8')),
    };
    const result = await this.geoDataModel.create(geodata, { returning: true });
    return result;
  }

  async getAllGeoData(): Promise<GeoData[]> {
    return this.geoDataModel.findAll();
  }
}
