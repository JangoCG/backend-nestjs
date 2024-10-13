import { Controller, Post, Res, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { JwtRefreshAuthGuard } from "./guards/jwt-refresh-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("xx login", user);
    return this.authService.login(user, response);
  }

  @Post("refresh")
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log("xx refresh", user);
    return this.authService.login(user, response);
  }
}
