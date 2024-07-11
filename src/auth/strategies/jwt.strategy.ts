import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from 'passport-jwt'
import { DatabaseService } from "src/database/database.service";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        configService: ConfigService,
        private databaseService: DatabaseService        
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_AT_SECRET'), 
        })
    }

    async validate(payload: any) {
        const user = await this.databaseService.user.findUnique({
            where: {
                id: payload?.userId
            }, 
            select: {
                id: true,
                name: true,
                email: true,
            }
        })
        return user;
    }
}