import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { randomInt } from 'crypto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async create(createLinkDto: CreateLinkDto, userId: string) {
    const { originalUrl, slug, title, description } = createLinkDto;

    // Generate slug if not provided
    let generatedSlug = slug;
    if (!generatedSlug) {
      generatedSlug = await this.generateUniqueSlug();
    }

    // Check if slug already exists
    const existingLink = await this.prisma.link.findUnique({
      where: { slug: generatedSlug },
    });

    if (existingLink) {
      if (slug) {
        throw new ConflictException('This slug is already taken');
      } else {
        // If auto-generated, try again with a new slug
        return this.create(createLinkDto, userId);
      }
    }

    return this.prisma.link.create({
      data: {
        originalUrl,
        slug: generatedSlug,
        title,
        description,
        userId,
      }
    });
  }

  async findAll(userId: string) {
    return this.prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
      include: {
        clicks: {
          orderBy: { clickedAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async findBySlug(slug: string) {
    const link = await this.prisma.link.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async update(id: string, updateLinkDto: UpdateLinkDto, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    const { slug, ...updateData } = updateLinkDto;

    // If slug is being updated, check if it's available
    if (slug && slug !== link.slug) {
      const existingLink = await this.prisma.link.findUnique({
        where: { slug },
      });

      if (existingLink) {
        throw new ConflictException('This slug is already taken');
      }

      (updateData as any).slug = slug;
    }

    return this.prisma.link.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return this.prisma.link.delete({
      where: { id },
    });
  }

  async trackClick(linkId: string, clickData: {
    ipAddress?: string;
    userAgent?: string;
    referer?: string;
    country?: string;
    city?: string;
  }) {
    // Create click record
    await this.prisma.click.create({
      data: {
        linkId,
        ...clickData,
      },
    });

    // Update click count
    await this.prisma.link.update({
      where: { id: linkId },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  async getStats(linkId: string, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id: linkId, userId },
      include: {
        clicks: {
          orderBy: { clickedAt: 'desc' },
        },
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    // Calculate additional stats
    const totalClicks = link._count.clicks;
    const todayClicks = link.clicks.filter(
      click => click.clickedAt.toDateString() === new Date().toDateString()
    ).length;

    const last7DaysClicks = link.clicks.filter(
      click => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return click.clickedAt.getTime() >= sevenDaysAgo.getTime();
      }
    ).length;

    // Get top referrers
    const referrerStats = link.clicks
      .filter(click => click.referer)
      .reduce((acc, click) => {
        acc[click.referer] = (acc[click.referer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topReferrers = Object.entries(referrerStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([referrer, count]) => ({ referrer, count }));

    // Get geographic stats
    const countryStats = link.clicks
      .filter(click => click.country)
      .reduce((acc, click) => {
        acc[click.country] = (acc[click.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topCountries = Object.entries(countryStats)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    return {
      link: {
        id: link.id,
        originalUrl: link.originalUrl,
        slug: link.slug,
        title: link.title,
        description: link.description,
        clickCount: link.clickCount,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt,
      },
      stats: {
        totalClicks,
        todayClicks,
        last7DaysClicks,
        topReferrers,
        topCountries,
        recentClicks: link.clicks.slice(0, 10),
      },
    };
  }

  private async generateUniqueSlug(): Promise<string> {
    const maxAttempts = 10;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const slug = this.generateSlug();
      
      // Check if this slug already exists
      const existing = await this.prisma.link.findUnique({
        where: { slug },
        select: { id: true }
      });
      
      if (!existing) {
        return slug;
      }
      
      attempts++;
    }
    
    // If we've exhausted attempts, use a longer slug with timestamp
    return this.generateSlugWithTimestamp();
  }

  private generateSlug(): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 8; // 62^8 = ~218 trillion combinations
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomInt(0, chars.length)];
    }
    
    return result;
  }

  private generateSlugWithTimestamp(): string {
    // Fallback: combine random string with timestamp for guaranteed uniqueness
    const timestamp = Date.now().toString(36); 
    const randomPart = this.generateSlug().substring(0, 4);
    return `${randomPart}${timestamp}`.substring(0, 12); // Max 12 chars
  }

} 