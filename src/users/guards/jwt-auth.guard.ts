import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('token missing');

    const [, token] = authHeader.split(' ');
    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'default_secret';
      const payload = this.jwtService.verify(token, { secret });
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('invalid token');
    }
  }
}
