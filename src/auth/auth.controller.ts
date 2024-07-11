import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.auth.dto';
import { SignInDto } from './dto/sign-in.auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupData: SignUpDto) {
    return this.authService.signup(signupData);
  }
  
  @Post('signin')
  signin(@Body() signinData: SignInDto) {
    return this.authService.signin(signinData);
  }
  

}
