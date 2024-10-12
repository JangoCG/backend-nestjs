import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';

@Injectable()
export class UserService {
  createUser(request: CreateUserRequestDto) {}
}
