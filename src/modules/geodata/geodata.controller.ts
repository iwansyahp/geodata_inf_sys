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
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/decorators/auth.decorator';

import * as fs from 'fs';
import * as path from 'path';

import * as gjv from 'geojson-validation';
import { GeodataService } from './geodata.service';
import { GeoJsonFileValidationPipe } from './pipes/geojson-file-validation/geojson-file-validation.pipe';
import { GEO_JSON_EXTENSION } from './constants/geodata.constants';
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
  @Post('/file')
  @UsePipes(GeoJsonFileValidationPipe)
  @ApiOperation({ summary: 'Upload single GeoJSON file' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    required: true,
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  multipleFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: GEO_JSON_EXTENSION[0] }),
          new FileTypeValidator({ fileType: GEO_JSON_EXTENSION[1] }),
          new GeoJsonFileValidationPipe(),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // Error handling array
    const errors = [];

    if (
      file.mimetype !== 'application/json' &&
      file.mimetype !== 'application/geo+json'
    ) {
      errors.push({
        filename: file.originalname,
        error: 'File is not a GeoJSON',
      });
    }

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
      gjv.validate(filePath);

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
