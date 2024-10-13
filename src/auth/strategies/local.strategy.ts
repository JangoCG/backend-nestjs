import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: "email" });
  }

  /**
   * This method is called when the user is authenticated. We check the user's credentials here against the database
   * @param username
   * @param password
   */
  async validate(username: string, password: string) {
    return this.authService.verifyUser(username, password);
  }
}
