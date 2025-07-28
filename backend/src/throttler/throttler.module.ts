import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerService } from './throttler.service';
import { CustomThrottlerGuard } from './guards/custom-throttler.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute for general endpoints
      }
    ]),
  ],
  providers: [
    CustomThrottlerService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard, // Use our custom guard instead of the default one
    },
  ],
  exports: [CustomThrottlerService],
})
export class AppThrottlerModule {} 