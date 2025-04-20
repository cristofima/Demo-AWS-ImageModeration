import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
import { UserModel } from './user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const region = configService.get<string>('COGNITO_APP_REGION');
    const userPoolId = configService.get<string>('COGNITO_USER_POOL_ID');
    const clientId = configService.get<string>('COGNITO_APP_CLIENT_ID');

    if (!region || !userPoolId || !clientId) {
      throw new Error(
        'Missing environment variables for Cognito configuration.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: clientId,
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
      }),
    });
  }

  validate(payload: any): UserModel {
    return {
      userId: payload.sub,
      nickname: payload.nickname,
      email: payload.email,
    };
  }
}
