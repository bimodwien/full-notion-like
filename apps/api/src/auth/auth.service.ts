import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const password = await argon2.hash(dto.password);
    const user = await this.usersService.create({ ...dto, password });

    return { id: user.id, email: user.email, name: user.name };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    const valid = user && (await argon2.verify(user.password, dto.password));
    if (!user || !valid) {
      throw new UnauthorizedException('Invalid Email or Password');
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    return { accessToken };
  }
}
