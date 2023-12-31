import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

export interface RequestWithUser extends Request {
  user: { id: string };
}

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const prod = process.env.NODE_ENV === 'production';
    if (prod) {
      const authToken = req.cookies['auth_token'];
      if (authToken) {
        try {
          const decodedToken = this.jwtService.verify(authToken);
          req.user = decodedToken;
        } catch (err) {
          console.log('Token verification failed:', err);
        }
      }
    } else {
      if (req.headers.authorization) {
        const [type, token] = req.headers.authorization.split(' ');
        if (type === 'Bearer') {
          try {
            const decodedToken = this.jwtService.verify(token);
            req.user = decodedToken;
          } catch (err) {
            console.log('Token verification failed:', err);
          }
        }
      }
    }

    next();
  }
}
