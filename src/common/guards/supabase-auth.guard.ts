import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../config/supabase.config';
import { Request } from 'express';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      const user = await this.supabaseService.verifyToken(token);

      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Attach the user to the request object
      request['user'] = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    // Support both "Bearer <token>" and just "<token>"
    const parts = authHeader.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    // If no "Bearer" prefix, treat the whole header as the token
    return authHeader;
  }
}
