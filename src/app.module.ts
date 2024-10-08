import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database/database.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [ConfigModule.forRoot(
    {
      isGlobal: true,
      envFilePath: '.env',
    }
  ), DatabaseModule, AuthModule, UserModule, PostModule],
  providers: [DatabaseService],
})
export class AppModule {}
