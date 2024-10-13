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

  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log("xx im validate");
    console.log("xx profile", profile);
    const foundOrCreatedUser = await this.userService.getOrCreateUser({
      email: profile.emails[0].value,
      // users created with a social provider will have an empty password to
      // indicate that they were created with a social provider
      password: "",
    });
    console.log("xx found or created user", foundOrCreatedUser);
    return foundOrCreatedUser;
  }
}
