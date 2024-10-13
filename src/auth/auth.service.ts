import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./token-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { hash } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException("Invalid credentials");
      }
      return user;
    } catch (err) {}
    throw new UnauthorizedException("Invalid credentials");
  }

  async verifyRefreshToken(refreshToken: string, userId: number) {
    try {
      const user = await this.userService.getUser({ id: userId });
      console.log("XX user ist", user);
      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException("Invalid refresh token");
      }
      return user;
    } catch (err) {
      console.log("xx im catch", err);
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async login(user: User, response: Response) {
    const dateWhenJwtAccessTokenExpires = new Date();
    dateWhenJwtAccessTokenExpires.setMilliseconds(
      dateWhenJwtAccessTokenExpires.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            "JWT_ACCESS_TOKEN_EXPIRATION_MS",
          ),
        ),
    );

    // Create a date when the JWT Refresh Token expires
    const dateWhenJwtRefreshTokenExpires = new Date();

    // Add the expiration time to the the values from the config
    dateWhenJwtRefreshTokenExpires.setMilliseconds(
      dateWhenJwtRefreshTokenExpires.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            "JWT_REFRESH_TOKEN_EXPIRATION_MS",
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    // 1. Create a JWT Access Token
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_TOKEN_SECRET"),
      expiresIn: `${this.configService.getOrThrow<string>(
        "JWT_ACCESS_TOKEN_EXPIRATION_MS",
      )}ms`, // this uses the MS library under the hood so we need to postfix it with ms
    });

    // 2. Create a JWT Refresh Token
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: `${this.configService.getOrThrow<string>(
        "JWT_REFRESH_TOKEN_EXPIRATION_MS",
      )}ms`,
    });

    // 3. Save the Refresh Token in the database, so we can revoke it anytime (aka rotate his refresh token), when e.g. his account is compromised
    // So a hacked user cannot be logged in forever
    await this.userService.updateUser(
      { id: user.id },
      { refreshToken: await hash(refreshToken, 10) },
    );

    // 4. Set the JWT Access Token as a cookie. Use the same expiration time as the token
    response.cookie("Authentication", accessToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      expires: dateWhenJwtAccessTokenExpires,
    });

    // 5. Set the JWT Refresh Token as a cookie as well. Use the same expiration time as the token
    response.cookie("Refresh", refreshToken, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      expires: dateWhenJwtRefreshTokenExpires,
    });
    // return { tokenPayload };
  }
}
