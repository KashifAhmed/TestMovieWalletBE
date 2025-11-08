import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Verify the JWT token from the Authorization header
   * @param token - The JWT token from the Authorization header
   * @returns User object if valid, null if invalid
   */
  async verifyToken(token: string) {
    try {
      const { data, error } = await this.supabaseClient.auth.getUser(token);

      if (error || !data.user) {
        return null;
      }

      return data.user;
    } catch (error) {
      return null;
    }
  }
}
