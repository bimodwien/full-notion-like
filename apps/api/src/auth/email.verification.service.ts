import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { hashToken } from './token.hash';

const VERIFY_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class EmailVerificationService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  // A new link replaces the old one, so only the latest email works.
  async send(user: { id: string; email: string }) {
    const token = randomBytes(32).toString('hex');
    const data = {
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
    };
    await this.prisma.emailVerification.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data },
      update: data,
    });
    const link = `${this.config.getOrThrow<string>('WEB_ORIGIN')}/verify-email?token=${token}`;
    await this.mail.send(
      user.email,
      'Verify your email for NoBimotion',
      `Open this link to verify your email:\n${link}\n\nThe link expires in 10 minutes.`,
    );
  }

  async verify(token: string) {
    const record = await this.prisma.emailVerification.findUnique({
      where: { tokenHash: hashToken(token) },
    });
    if (!record || record.expiresAt < new Date()) return false;

    // deleteMany, not delete: a double click must not turn into a 500.
    await this.prisma.$transaction([
      this.prisma.emailVerification.deleteMany({
        where: { userId: record.userId },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
    ]);
    return true;
  }
}
