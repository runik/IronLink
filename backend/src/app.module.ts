import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LinksModule } from './links/links.module';
import { AppThrottlerModule } from './throttler/throttler.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, LinksModule, AppThrottlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
