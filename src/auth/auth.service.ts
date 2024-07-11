import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.auth.dto';
import * as argon from 'argon2'
import { DatabaseService } from '../database/database.service';
import { ResponseData } from '../global/globalClass';
import { HttpMessage, HttpStatus } from '../global/globalEmun';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async signup(signupData: SignUpDto) {
    const { name , email, password } = signupData; 
    // check if user already exists
    const userExists = await this.databaseService.user.findUnique({ where: { email } });
    if (userExists) {
      return new ResponseData<null>(null, HttpStatus.CONFLICT, HttpMessage.ERROR_CONFLICT);
    }
    const hashedPassword = await argon.hash(signupData.password);
    // create new user

    const user = await this.databaseService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }, 
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return new ResponseData<SignUpDto>(user, HttpStatus.CREATED, HttpMessage.SUCCESS_CREATED);
  }

  async signin(signinData: SignInDto) {
    // TODO: implement JWT login logic
    // return new ResponseData<any>(null, HttpStatus.SUCCESS, HttpMessage.SUCCESS_OK);
    const {email , password} = signinData;
    const user = await this.databaseService.user.findUnique({ where: { email } });
    if (!user) {
      return new ResponseData<null>(null, HttpStatus.NOT_FOUND, HttpMessage.ERROR_NOT_FOUND);
    }

    const isPasswordValid = await argon.verify(user.password, password);
    if (!isPasswordValid) {
      return new ResponseData<null>(null, HttpStatus.UNAUTHORIZED, HttpMessage.ERROR_UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = await this.signJwtToken(user.id, user.email);

    await this.updateRtToDatabase(refreshToken, user.id);


    return new ResponseData<{ accessToken: string, refreshToken: string, }>(
      { accessToken, refreshToken },
      HttpStatus.SUCCESS,
      HttpMessage.SUCCESS_OK
    );
  }
  async updateRtToDatabase (rt: string, userId: number) {
    // update refresh token in database
    await this.databaseService.user.update({
      where: { id: userId },
      data: { refreshToken: rt }
    })
    return null;
  }

  async signJwtToken(userId: number, email: string) {
    const payload = { userId, email };
    const atSecretKey = this.configService.get('JWT_AT_SECRET');
    const rtSecretKey = this.configService.get('JWT_RT_SECRET');
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h', secret: atSecretKey });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d', secret: rtSecretKey }); 

    return { accessToken, refreshToken };
  }


}
