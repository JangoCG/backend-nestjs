import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      clientID: configService.getOrThrow("GOOGLE_AUTH_CLIENT_ID"),
      clientSecret: configService.getOrThrow("GOOGLE_AUTH_CLIENT_SECRET"),
      callbackURL: configService.getOrThrow("GOOGLE_AUTH_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  /**
   * This method is called when the user is redirected from the OAuth provider
   * @param accessToken The access token provided by the OAuth provider. We actually don't care about this, as we will create our own access token
   * @param refreshToken The refresh token provided by the OAuth provider. We don't care about this either, as we will create our own refresh token
   * @param profile The profile provided by the OAuth provider. This is actually the information we care about. It contains the user's email and other information
   */
  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.userService.getOrCreateUser({
      email: profile.emails[0].value,
      // users created with a social provider will have an empty password to
      // indicate that they were created with a social provider
      password: "",
    });
  }
}
