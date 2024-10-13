import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateUserRequestDto } from "./dto/create-user-request.dto";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "@prisma/client";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() request: CreateUserRequestDto) {
    return this.userService.createUser(request);
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
