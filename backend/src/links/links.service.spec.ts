import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LinksService', () => {
  let service: LinksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: PrismaService,
          useValue: {
            link: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            click: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateShortCode', () => {
    it('should generate a 6-character string', () => {
      const shortCode = (service as any).generateShortCode();
      expect(shortCode).toHaveLength(6);
      expect(typeof shortCode).toBe('string');
    });
  });
}); 