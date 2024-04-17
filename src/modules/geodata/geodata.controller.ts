import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/auth.decorator';

import { GeodataService } from './geodata.service';
import { GeoJsonFileValidationPipe } from './pipes/geojson-file-validation/geojson-file-validation.pipe';
import { Role } from '../auth/constants/auth.constant';

@ApiBearerAuth()
@Controller('geodata')
export class GeodataController {
  constructor(private geodataService: GeodataService) {}

  @ApiOperation({ summary: 'Get all uploaded GeoJson data' })
  @Get()
  async getAllGeoData() {
    return { data: await this.geodataService.getAllGeoData() };
  }

  @ApiOperation({ summary: 'Upload a GeoJSON file' })
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
  @Post('/upload')
  @Roles(Role.Admin) // only admin can upload data file
  @UsePipes(GeoJsonFileValidationPipe)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const result = await this.geodataService.processGeoJsonData(file);
    return { data: result };
  }
}
