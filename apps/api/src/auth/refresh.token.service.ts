import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class RefreshTokenService {
  constructor(private prisma: PrismaService) {}

  async issue(userId: string) {
    const token = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: this.hash(token),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });
    return token;
  }

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async consume(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(token) },
    });
    if (!record) return null;

    const { count } = await this.prisma.refreshToken.deleteMany({
      where: { id: record.id },
    });
    if (count === 0 || record.expiresAt < new Date()) return null;
    return record.userId;
  }

  async revoke(token: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { tokenHash: this.hash(token) },
    });
  }
}
