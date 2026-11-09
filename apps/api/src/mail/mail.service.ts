import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport?: Transporter;
  private readonly from: string;

  constructor(config: ConfigService) {
    const host = config.get<string>('SMTP_HOST');
    if (!host && process.env.NODE_ENV === 'production') {
      throw new Error('SMTP_HOST is required in production');
    }
    this.from =
      config.get<string>('MAIL_FROM') ?? 'NoBimotion <no-reply@localhost>';
    if (host) {
      const port = Number(config.get('SMTP_PORT') ?? 587);
      this.transport = createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user: config.get('SMTP_USER'), pass: config.get('SMTP_PASS') },
      });
    }
  }

  async send(to: string, subject: string, text: string) {
    // No SMTP in dev: the API log stands in for the inbox.
    if (!this.transport) {
      this.logger.log(`Mail to ${to}: ${subject}\n${text}`);
      return;
    }
    await this.transport.sendMail({ from: this.from, to, subject, text });
  }
}
