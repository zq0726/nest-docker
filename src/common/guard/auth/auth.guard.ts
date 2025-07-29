import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CacheService } from '@/cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, // JWT服务，用于验证和解析JWT token
    private configService: ConfigService, // 配置服务，用于获取JWT_SECRET
    private reflector: Reflector,
    private cacheService: CacheService,
  ) {}

  /**
   * 判断请求是否通过身份验证
   * @param context 执行上下文
   * @returns 是否通过身份验证
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // 获取请求对象
    const token = this.extractTokenFromHeader(request); // 从请求头中提取token
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    if (!token) {
      throw new HttpException('验证不通过', HttpStatus.FORBIDDEN); // 如果没有token，抛出验证不通过异常
    }
    const realToken = (await this.cacheService.get(token)) as unknown as string;
    try {
      const payload = await this.jwtService.verifyAsync(realToken, {
        secret: this.configService.get('JWT_SECRET'), // 使用JWT_SECRET解析token
      });

      // 获取token过期时间
      const { exp } = payload;
      console.log(exp);
      const nowTime = Math.floor(new Date().getTime() / 1000);

      const isExpired = exp - nowTime < 3600;
      console.log('isExpired', isExpired);
      if (isExpired) {
        const newPayload = { username: payload.username, sub: payload.sub };
        const newToken = this.jwtService.sign(newPayload);
        await this.cacheService.set(token, newToken, 7200);
      }

      request['user'] = payload; // 将解析后的用户信息存储在请求对象中
    } catch {
      throw new HttpException('token验证失败', HttpStatus.UNAUTHORIZED); // token验证失败，抛出异常
    }

    return true; // 身份验证通过
  }

  /**
   * 从请求头中提取token
   * @param request 请求对象
   * @returns 提取到的token
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []; // 从Authorization头中提取token
    return type === 'Bearer' ? token : undefined; // 如果是Bearer类型的token，返回token；否则返回undefined
  }
}
