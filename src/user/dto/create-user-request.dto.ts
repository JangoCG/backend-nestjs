import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
