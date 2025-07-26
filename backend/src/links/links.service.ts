import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}

  async create(createLinkDto: CreateLinkDto, userId: string) {
    const { originalUrl, slug, title, description } = createLinkDto;

    // Generate short code if not provided
    let shortCode = slug;
    if (!shortCode) {
      shortCode = this.generateShortCode();
    }

    // Check if short code already exists
    const existingLink = await this.prisma.link.findUnique({
      where: { shortCode },
    });

    if (existingLink) {
      if (slug) {
        throw new ConflictException('This slug is already taken');
      } else {
        // If auto-generated, try again
        return this.create(createLinkDto, userId);
      }
    }

    return this.prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        title,
        description,
        userId,
      },
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

  async findAll(userId: string) {
    return this.prisma.link.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            clicks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const link = await this.prisma.link.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
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

  async findByShortCode(shortCode: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortCode },
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

    if (!link.isActive) {
      throw new BadRequestException('Link is inactive');
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
    if (slug && slug !== link.shortCode) {
      const existingLink = await this.prisma.link.findUnique({
        where: { shortCode: slug },
      });

      if (existingLink) {
        throw new ConflictException('This slug is already taken');
      }

      (updateData as any).shortCode = slug;
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
        shortCode: link.shortCode,
        title: link.title,
        description: link.description,
        isActive: link.isActive,
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

  private generateShortCode(): string {
    // Generate a 6-character random string
    return randomBytes(3).toString('base64url').substring(0, 6);
  }
} 