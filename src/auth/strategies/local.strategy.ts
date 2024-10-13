import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // The validate() method is called by Passport when it has extracted the email and password from the request.
  async validate(username: string, password: string) {
    return this.authService.verifyUser(username, password);
  }
}
