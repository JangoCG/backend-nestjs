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

  /**
   * This method is used to verify the refresh token. We save the refresh token in the user's database record.
   * So to check if the refresh token is valid, we need to check if the refresh token in the request matches the one in the database.
   * @param request The request object
   * @param payload The payload of the JWT Refresh Token
   */
  async validate(request: Request, payload: TokenPayload) {
    return await this.authService.verifyRefreshToken(
      request.cookies?.Refresh,
      payload.userId,
    );
  }
}
