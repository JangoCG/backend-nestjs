import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  createUser(@Body() request: CreateUserRequestDto) {
    this.userService.createUser(request);
  }
}
