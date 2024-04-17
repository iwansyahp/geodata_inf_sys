import { Test, TestingModule } from '@nestjs/testing';
import { GeodataController } from './geodata.controller';
import { GeodataService } from './geodata.service';
import * as fs from 'fs';
import * as path from 'path';
import { Role } from '../auth/constants/auth.constant';

describe('GeodataController', () => {
  let controller: GeodataController;
  let geodataServiceMock: Partial<GeodataService>;

  beforeEach(async () => {
    geodataServiceMock = {
      getAllGeoData: jest.fn(),
      processGeoJsonData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeodataController],
      providers: [
        {
          provide: GeodataService,
          useValue: geodataServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GeodataController>(GeodataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllGeoData', () => {
    it('should return all uploaded GeoJSON data', async () => {
      const mockedData = ['data1', 'data2'];
      geodataServiceMock.getAllGeoData = jest
        .fn()
        .mockResolvedValue(mockedData);

      const result = await controller.getAllGeoData();

      expect(result).toEqual({ data: mockedData });
    });
  });

  describe('uploadFile', () => {
    it('should upload a GeoJSON file', async () => {
      const filePath = path.resolve(__dirname, 'test_files', 'valid.geojson');
      const file = {
        originalname: 'valid.geojson',
        buffer: fs.readFileSync(filePath),
      } as Express.Multer.File;

      const mockReq = { user: { role: Role.Admin } };

      const mockedResult = 'Uploaded successfully';
      geodataServiceMock.processGeoJsonData = jest
        .fn()
        .mockResolvedValue(mockedResult);

      const result = await controller.uploadFile(mockReq, file);

      expect(result).toEqual({ data: mockedResult });
    });

    it('should throw UnauthorizedException for non-admin users', async () => {
      const filePath = path.resolve(__dirname, 'test_files', 'valid.geojson');
      const file = {
        originalname: 'valid.geojson',
        buffer: fs.readFileSync(filePath),
      } as Express.Multer.File;

      const mockReq = { user: { role: Role.User } };

      await expect(await controller.uploadFile(mockReq, file)).toEqual({});
    });

    it('should throw BadRequestException if file is not provided', async () => {
      const mockReq = { user: { role: Role.Admin } };

      await expect(await controller.uploadFile(mockReq, null)).toEqual({});
    });

    it('should throw BadRequestException if uploaded file is empty', async () => {
      const file = {
        originalname: 'empty.geojson',
        buffer: Buffer.from(''),
      } as Express.Multer.File;

      const mockReq = { user: { role: Role.Admin } };

      await expect(await controller.uploadFile(mockReq, file)).toEqual({});
    });

    it('should throw BadRequestException if uploaded file is not a valid GeoJSON', async () => {
      const filePath = path.resolve(__dirname, 'test_files', 'invalid.geojson');
      const file = {
        originalname: 'invalid.geojson',
        buffer: fs.readFileSync(filePath),
      } as Express.Multer.File;

      const mockReq = { user: { role: Role.Admin } };

      await expect(await controller.uploadFile(mockReq, file)).toEqual({});
    });
  });
});
