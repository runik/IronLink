import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  HttpException, 
  HttpStatus, 
  UseGuards, 
  Request, 
  Res,
  HttpCode,
  HttpRedirectResponse
} from '@nestjs/common';
import { Response } from 'express';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createLinkDto: CreateLinkDto, @CurrentUser() user) {
    try {
      return await this.linksService.create(createLinkDto, user.id);
    } catch (error) {
      console.error('Link creation error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Bad Request',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user) {
    return this.linksService.findAll(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.linksService.findOne(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getStats(@Param('id') id: string, @CurrentUser() user) {
    return this.linksService.getStats(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string, 
    @Body() updateLinkDto: UpdateLinkDto, 
    @CurrentUser() user
  ) {
    try {
      return this.linksService.update(id, updateLinkDto, user.id);
    } catch (error) {
      console.error('Link update error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Bad Request',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.linksService.remove(id, user.id);
  }

  // Public redirect endpoint - no authentication required
  @Get('r/:shortCode')
  @HttpCode(302)
  async redirect(
    @Param('shortCode') shortCode: string,
    @Request() req,
    @Res() res: Response
  ) {
    try {
      const link = await this.linksService.findByShortCode(shortCode);
      
      // Track the click
      await this.linksService.trackClick(link.id, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
        // Note: For country/city detection, you'd need to integrate with a geolocation service
        // like MaxMind GeoIP2, IP2Location, or similar
      });

      // Redirect to the original URL
      return res.redirect(link.originalUrl);
    } catch (error) {
      console.error('Redirect error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Link not found',
        HttpStatus.NOT_FOUND
      );
    }
  }
} 