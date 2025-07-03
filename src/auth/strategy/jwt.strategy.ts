import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
  
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables!');
    }
  
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // 🔥 pastikan ini string, bukan undefined
    });
  }  

  async validate(payload: any) {
    return {
      id: payload.sub, // ← ini penting
      uuid: payload.uuid,
      email: payload.email,
      username: payload.username,
      full_name: payload.full_name,
      bio: payload.bio,
      role: payload.role,
      is_verified: payload.is_verified,
    };
  }
}
