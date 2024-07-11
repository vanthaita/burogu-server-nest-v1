import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(@Req() request: any) {
    return this.userService.me(request);
  }
  
}
