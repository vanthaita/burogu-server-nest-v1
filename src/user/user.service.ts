import { Injectable, Req } from '@nestjs/common';
@Injectable()
export class UserService {
  me(@Req() request: any) {
    const user = request.user;
    console.log(user);
    return { message: 'This action returns current user' };
  }
}
