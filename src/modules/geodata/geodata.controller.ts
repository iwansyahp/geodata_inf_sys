import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/decorators/auth.decorator';

import * as fs from 'fs';
import * as path from 'path';

import * as gjv from 'geojson-validation';
import { GeodataService } from './geodata.service';
import { GeoJsonFileValidationPipe } from './pipes/geojson-file-validation/geojson-file-validation.pipe';
import { GEO_JSON_MIMETYPE } from './constants/geodata.constants';
import { ConfigService } from '@nestjs/config';

@Public() // TODO: remove when done
// @Roles(Role.ADMIN)
@Controller('geodata')
export class GeodataController {
  constructor(
    private configService: ConfigService,
    private geodataService: GeodataService,
  ) {}

  @Get()
  getAllGeoData() {
    return this.geodataService.getAllGeoData();
  }

  // @Roles(Role.Admin)  // only admin can upload data file
  @ApiOperation({ summary: 'Upload single GeoJSON file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/file')
  @UsePipes(GeoJsonFileValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  multipleFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    // Error handling array
    const errors = [];

    // Construct file path
    const uniqueSuffix = Date.now() + '-';
    const filePath = path.join(
      './',
      'uploads',
      uniqueSuffix + file.originalname,
    );

    try {
      // Write the file to the filesystem
      fs.writeFileSync(filePath, file.buffer);

      // TODO: Add validation via middleware
      // use gjv to validation given GeoJson
      // gjv.validate(filePath);

      // // Additional validation for GeoJSON format
      const jsonData = JSON.parse(file.buffer.toString());
      if (
        !jsonData.type ||
        jsonData.type !== 'FeatureCollection' ||
        !jsonData.features
      ) {
        // Invalid GeoJSON format
        fs.unlinkSync(filePath); // Remove the file
        errors.push({
          filename: file.originalname,
          error: 'Invalid GeoJSON format',
        });
      }
    } catch (error) {
      // Error occurred during file handling
      fs.unlinkSync(filePath); // Remove the file
      errors.push({ filename: file.originalname, error: error.message });
    }

    // Check if any errors occurred
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Some files could not be processed',
        errors,
      });
    }
    return this.geodataService.processGeoJsonData();
  }
}
