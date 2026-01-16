import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
  type JwtFromRequestFunction,
} from 'passport-jwt';
import type { Request } from 'express';
import { UsersService } from 'src/users/user.service';

type JwtPayload = {
  sub: number;
  email?: string;
  role?: 'admin' | 'user';
};

const extractJwtFromCookie: JwtFromRequestFunction = (
  req: Request,
): string | null => {
  if (!req) return null;

  const name = process.env.COOKIE_NAME ?? 'access_token';

  const token = req.cookies?.[name];
  if (typeof token === 'string' && token.length > 0) return token;

  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(';').map((c) => c.trim());
  const found = parts.find((c) => c.startsWith(`${name}=`));
  if (!found) return null;

  const raw = found.slice(name.length + 1);
  return raw ? decodeURIComponent(raw) : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractJwtFromCookie]),
      secretOrKey: process.env.JWT_SECRET ?? 'dev_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = Number(payload.sub);
    if (!userId) throw new UnauthorizedException('Invalid token payload');

    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    return { id: user.id, email: user.email, role: user.role };
  }
}
