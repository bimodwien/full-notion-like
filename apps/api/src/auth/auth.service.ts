import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { isUniqueViolation } from '../prisma/prisma.errors';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenService } from './refresh.token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const password = await argon2.hash(dto.password);
    try {
      const user = await this.usersService.create({ ...dto, password });
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

    return this.issueTokens(user.id);
  }

  async refresh(refreshToken: string) {
    const userId = await this.refreshTokenService.consume(refreshToken);
    if (!userId) throw new UnauthorizedException('Invalid refresh token');
    return this.issueTokens(userId);
  }

  async logout(refreshToken: string) {
    await this.refreshTokenService.revoke(refreshToken);
  }

  private async issueTokens(userId: string) {
    const accessToken = await this.jwtService.signAsync({ sub: userId });
    const refreshToken = await this.refreshTokenService.issue(userId);
    return { accessToken, refreshToken };
  }
}
