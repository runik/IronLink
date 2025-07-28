import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CustomThrottlerService } from '../throttler.service';
import { THROTTLE_LIMIT, THROTTLE_SKIP } from '../decorators/throttle.decorator';

@Injectable()
export class CustomThrottlerGuard {
  constructor(
    private readonly throttlerService: CustomThrottlerService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipThrottle = this.reflector.getAllAndOverride<boolean>(THROTTLE_SKIP, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipThrottle) {
      return true;
    }

    let throttleConfig = this.reflector.getAllAndOverride<{ limit: number; ttl: number }>(
      THROTTLE_LIMIT,
      [context.getHandler(), context.getClass()],
    );

    if (!throttleConfig) {
      // Use default rate limiting
      throttleConfig = { limit: 10, ttl: 60000 };
    }

    const request = context.switchToHttp().getRequest();
    const identifier = this.getIdentifier(request);

    const isLimited = await this.throttlerService.isRateLimited(
      identifier,
      throttleConfig.ttl,
      throttleConfig.limit,
    );

    if (isLimited) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Rate limit exceeded. Please try again later.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private getIdentifier(request: any): string {
    // Use IP address as primary identifier
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    
    // Add user ID if available for authenticated requests
    const userId = request.user?.id;
    if (userId) {
      return `${ip}:user:${userId}`;
    }
    
    return ip;
  }
} 