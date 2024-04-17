import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import * as geojsonhint from 'geojsonhint';

@Injectable()
export class GeoJsonFileValidationPipe implements PipeTransform {
  transform(value: any) {
    const content: string = value.buffer.toString('utf-8');

    // check if given file is a valid geojson files
    const errors = geojsonhint.hint(content);

    if (errors.length > 0) {
      console.log(errors);
      throw new BadRequestException('Invalid GeoJSON data.');
    }

    return value;
  }
}
