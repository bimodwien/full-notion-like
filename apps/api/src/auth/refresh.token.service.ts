import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { hashToken } from './token.hash';

export const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class RefreshTokenService {
  constructor(private prisma: PrismaService) {}

  async issue(userId: string) {
    const token = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      },
    });
    return token;
  }

  async consume(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(token) },
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
      where: { tokenHash: hashToken(token) },
    });
  }
}
