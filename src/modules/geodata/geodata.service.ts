import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeodataService {
  private readonly logger = new Logger(GeodataService.name);

  async processGeoJsonData(): Promise<{ message: string }> {
    this.logger.debug('Process uploaded data...');
    return { message: 'Data sucessfully processed' };
  }

  async getAllGeoData(): Promise<{ data: [] }> {
    return { data: [] };
  }
}
