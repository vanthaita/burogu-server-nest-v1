import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import {JwtStrategy} from './strategies/index'
@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, DatabaseService, JwtStrategy],
})
export class AuthModule {}
