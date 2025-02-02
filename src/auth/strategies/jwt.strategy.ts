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
      /**
       * This is the secret key for the JWT Access Token.
       * It is used to sign the JWT Access Token.
       */
      secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
      /**
       * This is the function that extracts the JWT Access Token from the request.
       * It is used to extract the JWT Access Token from the request cookies and from the Authorization header (bearer token).
       * It will first check the cookies for the JWT Access Token and then check the Authorization header (bearer token) for the JWT Access Token.
       */
      jwtFromRequest: ExtractJwt.fromExtractors([
        // First check cookie
        (req: Request) => req?.cookies?.Authentication,
        // Then check bearer token
        ExtractJwt.fromAuthHeaderAsBearerToken(),
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
