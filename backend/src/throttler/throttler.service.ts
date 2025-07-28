import { Injectable, Logger } from '@nestjs/common';

interface RateLimitRecord {
  hits: number;
  resetTime: number;
}

@Injectable()
export class CustomThrottlerService {
  private readonly logger = new Logger(CustomThrottlerService.name);
  private readonly rateLimitStore = new Map<string, RateLimitRecord>();

  async isRateLimited(identifier: string, ttl: number, limit: number): Promise<boolean> {
    try {
      const now = Date.now();
      const record = this.rateLimitStore.get(identifier);

      if (!record || now > record.resetTime) {
        // No record or expired, create new one
        this.rateLimitStore.set(identifier, {
          hits: 1,
          resetTime: now + ttl,
        });
        return false;
      }

      if (record.hits >= limit) {
        this.logger.warn(`Rate limit exceeded for ${identifier}. Hits: ${record.hits}, Limit: ${limit}`);
        return true;
      }

      // Increment hits
      record.hits++;
      return false;
    } catch (error) {
      this.logger.error(`Error checking rate limit for ${identifier}:`, error);
      return false; // Allow request if rate limiting fails
    }
  }

  async getRateLimitInfo(identifier: string): Promise<{
    totalHits: number;
    timeToExpire: number;
    remaining: number;
  }> {
    try {
      const now = Date.now();
      const record = this.rateLimitStore.get(identifier);
      
      if (!record || now > record.resetTime) {
        return {
          totalHits: 0,
          timeToExpire: 0,
          remaining: 10,
        };
      }

      return {
        totalHits: record.hits,
        timeToExpire: record.resetTime - now,
        remaining: Math.max(0, 10 - record.hits),
      };
    } catch (error) {
      this.logger.error(`Error getting rate limit info for ${identifier}:`, error);
      return {
        totalHits: 0,
        timeToExpire: 0,
        remaining: 10,
      };
    }
  }

  async resetRateLimit(identifier: string): Promise<void> {
    try {
      this.rateLimitStore.delete(identifier);
      this.logger.log(`Rate limit reset for ${identifier}`);
    } catch (error) {
      this.logger.error(`Error resetting rate limit for ${identifier}:`, error);
    }
  }
} 