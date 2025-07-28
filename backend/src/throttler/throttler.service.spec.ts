import { Test, TestingModule } from '@nestjs/testing';
import { CustomThrottlerService } from './throttler.service';

describe('CustomThrottlerService', () => {
  let service: CustomThrottlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomThrottlerService],
    }).compile();

    service = module.get<CustomThrottlerService>(CustomThrottlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow requests within limit', async () => {
    const identifier = 'test-ip';
    const limit = 5;
    const ttl = 60000;

    // First 5 requests should be allowed
    for (let i = 0; i < 5; i++) {
      const isLimited = await service.isRateLimited(identifier, ttl, limit);
      expect(isLimited).toBe(false);
    }

    // 6th request should be limited
    const isLimited = await service.isRateLimited(identifier, ttl, limit);
    expect(isLimited).toBe(true);
  });

  it('should reset rate limit after TTL expires', async () => {
    const identifier = 'test-ip-expiry';
    const limit = 3;
    const ttl = 100; // 100ms for testing

    // Make 3 requests (at limit)
    for (let i = 0; i < 3; i++) {
      await service.isRateLimited(identifier, ttl, limit);
    }

    // 4th request should be limited
    let isLimited = await service.isRateLimited(identifier, ttl, limit);
    expect(isLimited).toBe(true);

    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 150));

    // Should allow requests again
    isLimited = await service.isRateLimited(identifier, ttl, limit);
    expect(isLimited).toBe(false);
  });

  it('should get correct rate limit info', async () => {
    const identifier = 'test-info';
    const limit = 10;
    const ttl = 60000;

    // Make a few requests
    for (let i = 0; i < 3; i++) {
      await service.isRateLimited(identifier, ttl, limit);
    }

    const info = await service.getRateLimitInfo(identifier);
    expect(info.totalHits).toBe(3);
    expect(info.remaining).toBe(7);
    expect(info.timeToExpire).toBeGreaterThan(0);
  });

  it('should reset rate limit', async () => {
    const identifier = 'test-reset';
    const limit = 5;
    const ttl = 60000;

    // Make some requests
    for (let i = 0; i < 3; i++) {
      await service.isRateLimited(identifier, ttl, limit);
    }

    // Reset the rate limit
    await service.resetRateLimit(identifier);

    // Should allow requests again
    const isLimited = await service.isRateLimited(identifier, ttl, limit);
    expect(isLimited).toBe(false);
  });
}); 