import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@supabase/supabase-js';

/**
 * Decorator to extract the authenticated Supabase user from the request
 * Usage: @SupabaseUser() user: User
 */
export const SupabaseUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
