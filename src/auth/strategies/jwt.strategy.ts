import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "../token-payload.interface";
import { UserService } from "../../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.Authentication;
        },
      ]),
    });
  }

  /**
   * This method is called when the user is authenticated. If we can find a user
   * with the userId from the Access Token, we consider the user authenticated
   * @param payload The payload of the JWT Access Token
   */
  validate(payload: TokenPayload) {
    return this.userService.getUser({ id: payload.userId });
  }
}
