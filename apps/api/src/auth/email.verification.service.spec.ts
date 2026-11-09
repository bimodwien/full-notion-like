import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailVerificationService } from './email.verification.service';
import { hashToken } from './token.hash';

jest.mock('../prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('../mail/mail.service', () => ({ MailService: class {} }));

function setup(record?: { userId: string; expiresAt: Date }) {
  const prisma = {
    emailVerification: {
      upsert: jest.fn(),
      findUnique: jest.fn().mockResolvedValue(record ?? null),
      deleteMany: jest.fn(),
    },
    user: { update: jest.fn() },
    $transaction: jest.fn(),
  };
  const mail = { send: jest.fn() };
  const config = { getOrThrow: () => 'http://web.test' };
  const service = new EmailVerificationService(
    prisma as unknown as PrismaService,
    mail as unknown as MailService,
    config as unknown as ConfigService,
  );
  return { service, prisma, mail };
}

describe('EmailVerificationService', () => {
  it('stores only the hash of the token it emails', async () => {
    const { service, prisma, mail } = setup();
    await service.send({ id: 'u1', email: 'a@b.test' });

    const text = mail.send.mock.calls[0][2] as string;
    const token = /verify-email\?token=([a-f0-9]+)/.exec(text)![1];
    const { create } = prisma.emailVerification.upsert.mock.calls[0][0];
    expect(create.tokenHash).toBe(hashToken(token));
    expect(text).not.toContain(create.tokenHash);
  });

  it('rejects an unknown token', async () => {
    const { service, prisma } = setup();
    expect(await service.verify('nope')).toBe(false);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rejects an expired token', async () => {
    const { service, prisma } = setup({
      userId: 'u1',
      expiresAt: new Date(Date.now() - 1000),
    });
    expect(await service.verify('old')).toBe(false);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('marks the user verified and spends the token', async () => {
    const { service, prisma } = setup({
      userId: 'u1',
      expiresAt: new Date(Date.now() + 60_000),
    });
    expect(await service.verify('good')).toBe(true);
    expect(prisma.emailVerification.deleteMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });
    expect(prisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'u1' } }),
    );
  });
});
