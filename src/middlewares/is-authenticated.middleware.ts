import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

import * as jwt from 'jsonwebtoken'

@Injectable()
export class IsAuthenticatedMiddleware implements NestMiddleware {

  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers['authorization'];
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNhbWlyIiwiaWF0IjoxNzQ3NTA0NTE2fQ.vlSVx1i6x9yd30C8uBYQY5UWxG7M1dJUCKQ0ymlU3aE
    if(!bearerToken) {
        throw new UnauthorizedException();
    }

    const [_bearer, token] = bearerToken.split(' ');

    if(!token) {
        throw new UnauthorizedException();
    }

    try {
  
      const payload = jwt.verify(token, this.configService.getOrThrow<string>('JWT_SECRET'));
      req['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException();
    }
    
    next();
  }
}