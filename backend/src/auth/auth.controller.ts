import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Request, Get } from '@nestjs/common';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ThrottleAuth, SkipThrottle } from '../throttler/decorators/throttle.decorator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ThrottleAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    } catch (error) {
      console.error('Registration error:', error);
      // TODO: add more specific error messages for data validation.
      throw new HttpException(
        error.message || 'Registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ThrottleAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(req.user);
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user) {
    return user;
  }
} 