import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { ConfigService } from "@nestjs/config";
import { TokenPayload } from "./token-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";

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

  login(user: User, response: Response) {
    const timeWhenJwtTokenExpires = new Date();
    timeWhenJwtTokenExpires.setMilliseconds(
      timeWhenJwtTokenExpires.getMilliseconds() +
        parseInt(
          this.configService.getOrThrow<string>(
            "JWT_ACCESS_TOKEN_EXPIRATION_MS",
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
      )}ms`, // this uses the MS libary under the hood so we need to postfixed it with ms
    });

    // 2. Set the JWT Access Token as a cookie. Use the same expiration time as the token
    response.cookie("Authentication", accessToken, {
      secure: true,
      httpOnly: this.configService.get("NODE_ENV") === "production",
      expires: timeWhenJwtTokenExpires,
    });
    return { tokenPayload };
  }
}
