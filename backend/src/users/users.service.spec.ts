import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password before creating user', async () => {
      const createUserData = {
        email: 'test@example.com',
        password: 'plainPassword123',
        name: 'Test User',
      };

      const mockCreatedUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create(createUserData);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          password: expect.not.stringMatching('plainPassword123'), // Password should be hashed
          name: 'Test User',
        },
      });

      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('verifyPassword', () => {
    it('should verify password correctly', async () => {
      const plainPassword = 'testPassword123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const isValid = await service.verifyPassword(plainPassword, hashedPassword);
      expect(isValid).toBe(true);

      const isInvalid = await service.verifyPassword('wrongPassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });
}); 