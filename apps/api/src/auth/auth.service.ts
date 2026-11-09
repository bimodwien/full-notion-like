import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { isUniqueViolation } from '../prisma/prisma.errors';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationService } from './email.verification.service';
import { RefreshTokenService } from './refresh.token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private emailVerification: EmailVerificationService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const password = await argon2.hash(dto.password);
    try {
      const user = await this.usersService.create({
        email: dto.email,
        name: dto.name,
        password,
      });
      // The account exists either way; a failed send can be retried from sign in.
      await this.emailVerification
        .send(user)
        .catch((error) =>
          this.logger.error('Verification email failed', error),
        );
      return { id: user.id, email: user.email, name: user.name };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    const valid = user && (await argon2.verify(user.password, dto.password));
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid Email or Password');
    }
    // Checked after the password, so a stranger can't learn which emails are unverified.
    if (!user.emailVerifiedAt) {
      throw new ForbiddenException('Verify your email before signing in');
    }

    return this.issueTokens(user.id);
  }

  async verifyEmail(token: string) {
    if (!(await this.emailVerification.verify(token))) {
      throw new BadRequestException('This link is invalid or has expired');
    }
  }

  // Same reply for unknown and verified emails, so this can't probe accounts.
  async resendVerification(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && !user.emailVerifiedAt) await this.emailVerification.send(user);
  }

  async refresh(refreshToken: string | undefined) {
    const userId =
      refreshToken && (await this.refreshTokenService.consume(refreshToken));
    if (!userId) throw new UnauthorizedException('Invalid refresh token');
    return this.issueTokens(userId);
  }

  async logout(refreshToken: string) {
    await this.refreshTokenService.revoke(refreshToken);
  }

  // A token can outlive its user, so a missing row means signed out, not 404.
  async me(userId: string) {
    const profile = await this.usersService.findProfile(userId);
    if (!profile) throw new UnauthorizedException();
    return profile;
  }

  private async issueTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    const refreshToken = await this.refreshTokenService.issue(userId);
    return { accessToken, refreshToken };
  }
}
