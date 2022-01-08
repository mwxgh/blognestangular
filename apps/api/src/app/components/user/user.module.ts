import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { userProviders } from './user.providers';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [...userProviders],
})
export class UserModule {}
