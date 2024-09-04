import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, Logger } from "@nestjs/common";
import { passportJwtSecret } from "jwks-rsa";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

import { UserService, AuthService } from "src/service";
import { User } from "src/entities";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    const issuer = configService.getOrThrow('AUTH0_ISSUER_URL');
    const audience = configService.getOrThrow('AUDIENCE');
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: audience,
      issuer: issuer,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { sub: string }): Promise<User> {
    Logger.log(payload.sub)
    const filter = { auth0Id: payload.sub };
    try {
      await this.userService.update(payload.sub);
      return await this.userService.users.findOneByOrFail(filter);
    } catch (error) {
      Logger.warn(`User not found: ${payload.sub}, creating new user`);
      const user = await this.userService.create(payload.sub);
      return await this.userService.users.save(user);
    }
  }
}