import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { TokenPayload } from "../token-payload.interface";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      secretOrKey: configService.getOrThrow("JWT_REFRESH_TOKEN_SECRET"),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    console.log("xx validate", payload);
    return await this.authService.verifyRefreshToken(
      request.cookies?.Refresh,
      payload.userId,
    );
  }
}
