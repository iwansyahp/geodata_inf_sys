import { Test, TestingModule } from '@nestjs/testing';
import { GeodataService } from './geodata.service';
import { getModelToken } from '@nestjs/sequelize';
import { GeoData } from './models/geodata.model';
import { ConfigService } from '@nestjs/config';

describe('GeodataService', () => {
  let service: GeodataService;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        GeodataService,
        {
          provide: getModelToken(GeoData),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('/tmp'),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<GeodataService>(GeodataService);
  });

  afterEach(async () => {
    await moduleRef.close(); // Close the module after each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processGeoJsonData', () => {
    it('should process GeoJSON data and save to database', async () => {
      // Mock dependencies
      const geoDataModel = moduleRef.get<typeof GeoData>(
        getModelToken(GeoData),
      );
      const mockUploadedFileDto = {
        originalname: 'valid.json',
        buffer: Buffer.from('{"type":"FeatureCollection","features":[]}'),
        mimetype: 'application/json',
        size: 6,
      };

      // Mock create method of GeoData model
      geoDataModel.create = jest.fn().mockResolvedValueOnce({
        id: 1,
        fileName: 'valid.json',
        data: {},
      });

      // Call the service method
      const result = await service.processGeoJsonData(mockUploadedFileDto);

      // Assert the result
      expect(result).toEqual({ id: 1, fileName: 'valid.json', data: {} });
      expect(geoDataModel.create);
    });

    it('should throw BadRequestException if file processing fails', async () => {
      // Mock dependencies
      const geoDataModel = moduleRef.get<typeof GeoData>(
        getModelToken(GeoData),
      );
      const mockUploadedFileDto = {
        originalname: 'valid.json',
        buffer: Buffer.from('{"type":"FeatureCollection","features":[]}'),
        mimetype: 'application/json',
        size: 20,
      };

      // Mock create method of GeoData model to throw an error
      geoDataModel.create = jest
        .fn()
        .mockRejectedValueOnce(new Error('Database error'));

      // Call the service method and expect it to throw BadRequestException
      await expect(
        service.processGeoJsonData(mockUploadedFileDto),
      ).rejects.toThrowError(Error);
    });
  });

  describe('getAllGeoData', () => {
    it('should return all geo data', async () => {
      // Mock dependencies
      const geoDataModel = moduleRef.get<typeof GeoData>(
        getModelToken(GeoData),
      );
      const mockGeoData = [
        { id: 1, fileName: 'valid.json', data: {} },
        { id: 2, fileName: 'valid1.json', data: {} },
      ];

      // Mock findAll method of GeoData model
      geoDataModel.findAll = jest.fn().mockResolvedValueOnce(mockGeoData);

      // Call the service method
      const result = await service.getAllGeoData();

      // Assert the result
      expect(result).toEqual(mockGeoData);
    });
  });
});
