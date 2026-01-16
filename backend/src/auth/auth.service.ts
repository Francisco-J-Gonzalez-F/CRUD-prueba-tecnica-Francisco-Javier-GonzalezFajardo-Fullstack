import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string, res: Response) {
    const user = await this.users.findByEmailForAuth(email);

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const token = this.jwt.sign(payload);

    res.cookie(process.env.COOKIE_NAME ?? 'access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, 
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
