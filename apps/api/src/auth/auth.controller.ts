import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './authenticated.request';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt.auth.guard';
import {
  clearAuthCookies,
  setAuthCookies,
  REFRESH_COOKIE,
  readCookie,
} from './auth.cookies';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(204)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    setAuthCookies(res, await this.authService.login(dto));
  }

  @Post('refresh')
  @HttpCode(204)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      setAuthCookies(
        res,
        await this.authService.refresh(readCookie(req, REFRESH_COOKIE)),
      );
    } catch (error) {
      // A dead refresh cookie would keep proxy.ts treating the visitor as signed in.
      clearAuthCookies(res);
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = readCookie(req, REFRESH_COOKIE);
    if (refreshToken) await this.authService.logout(refreshToken);
    clearAuthCookies(res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return this.authService.me(req.user!.id);
  }
}
