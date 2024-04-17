import { Test, TestingModule } from '@nestjs/testing';
import { GeodataService } from './geodata.service';

describe('GeodataService', () => {
  let service: GeodataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeodataService],
    }).compile();

    service = module.get<GeodataService>(GeodataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
