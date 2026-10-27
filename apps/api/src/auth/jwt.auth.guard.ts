import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedRequest } from './authenticated.request';
import { readCookie, ACCESS_COOKIE } from './auth.cookies';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = readCookie(request, ACCESS_COOKIE);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(token);
      request.user = { id: payload.sub };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
