import {
  BadRequestException,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/decorators/auth.decorator';

import * as fs from 'fs';
import * as path from 'path';

import * as gjv from 'geojson-validation';

@Public()
@Controller('geodata')
export class GeodataController {
  @Post('/files')
  @ApiOperation({ summary: 'Upload multiple GeoJSON files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
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
  multipleFiles(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    // Error handling array
    const errors = [];

    // Process each uploaded file
    for (const file of files) {
      // Check if it's a GeoJSON file
      if (
        file.mimetype !== 'application/json' &&
        file.mimetype !== 'application/geo+json'
      ) {
        errors.push({
          filename: file.originalname,
          error: 'File is not a GeoJSON',
        });
        console.log(`skip file ${file.originalname}`);
        continue; // Skip this file
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
    }

    // Check if any errors occurred
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Some files could not be processed',
        errors,
      });
    }
    return { message: 'Files uploaded successfully' };
  }
}
