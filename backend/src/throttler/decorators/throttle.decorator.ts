import { SetMetadata } from '@nestjs/common';

export const THROTTLE_LIMIT = 'throttle:limit';
export const THROTTLE_TTL = 'throttle:ttl';
export const THROTTLE_SKIP = 'throttle:skip';

export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_LIMIT, { limit, ttl });

export const SkipThrottle = () => SetMetadata(THROTTLE_SKIP, true);

// Predefined rate limit decorators
export const ThrottleAuth = () => Throttle(5, 60000); // 5 requests per minute for auth
export const ThrottleLinkCreation = () => Throttle(20, 60000); // 20 requests per minute for link creation
export const ThrottleLinkAccess = () => Throttle(100, 60000); // 100 requests per minute for link access
export const ThrottleGeneral = () => Throttle(10, 60000); // 10 requests per minute for general endpoints 