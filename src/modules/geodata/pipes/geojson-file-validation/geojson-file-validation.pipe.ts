import {
  BadRequestException,
  Injectable,
  PipeTransform,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { UploadedFileDto } from '../../dto/uploaded.file.dto';
import { GEO_JSON_MIMETYPE } from '../../constants/geodata.constants';
import * as GeoJSONValidation from 'geojson-validation';
@Injectable()
export class GeoJsonFileValidationPipe implements PipeTransform {
  transform(value: UploadedFileDto) {
    const content: string = value.buffer.toString('utf-8');

    // 1. Check file type is valid
    if (!GEO_JSON_MIMETYPE.includes(value.mimetype.toLocaleLowerCase())) {
      throw new UnsupportedMediaTypeException(
        `File type isn't supported. Only json and geojson is accepted.`,
      );
    }

    // 2. Check if given JSON is valid
    try {
      JSON.parse(content);
    } catch (e) {
      throw new BadRequestException('Invalid JSON data.', e);
    }

    // 3. check that contained texts are valid GeoJSON
    if (!GeoJSONValidation.valid(JSON.parse(content))) {
      const trace = GeoJSONValidation.isGeoJSONObject(
        JSON.parse(content),
        true,
      );
      throw new BadRequestException(`Invalid GeoJSON data: ${trace}`);
    }
    return value;
  }
}
