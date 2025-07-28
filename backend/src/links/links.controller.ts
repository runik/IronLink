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
  HttpRedirectResponse,
  NotFoundException
} from '@nestjs/common';
import { Response } from 'express';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { get404Page, get500Page } from './templates/error-pages';
import { ThrottleLinkCreation, ThrottleLinkAccess, SkipThrottle } from '../throttler/decorators/throttle.decorator';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @ThrottleLinkCreation()
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

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user) {
    return this.linksService.findAll(user.id);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user) {
    return this.linksService.findOne(id, user.id);
  }

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Get(':id/stats')
  getStats(@Param('id') id: string, @CurrentUser() user) {
    return this.linksService.getStats(id, user.id);
  }

  @SkipThrottle()
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

  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.linksService.remove(id, user.id);
  }

  // Public redirect endpoint - no authentication required
  // Consider adding a rate limit here
  @SkipThrottle() 
  @Get('redirect/:slug')
  @HttpCode(302)
  async redirect(
    @Param('slug') slug: string,
    @Request() req,
    @Res() res: Response
  ) {
    try {
      const link = await this.linksService.findBySlug(slug);
      
      // Track the click
      await this.linksService.trackClick(link.id, {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referer: req.get('Referer'),
      });

      // Redirect to the original URL
      return res.redirect(link.originalUrl);
    } catch (error) {
      console.error('Redirect error:', error);
      
      // Check if it's a NotFoundException (link doesn't exist)
      if (error instanceof NotFoundException) {
        // Return a proper HTML 404 page
        res.status(404).send(get404Page(slug));
        return;
      }
      
      // For other errors, return a generic error page
      res.status(500).send(get500Page());
    }
  }
} 