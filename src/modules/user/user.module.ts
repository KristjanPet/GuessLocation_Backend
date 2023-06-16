import { forwardRef, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'entities/user.entity'
import { AuthService } from 'modules/auth/auth.service'
import { LocationModule } from 'modules/location/location.module'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => LocationModule)],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService],
  exports: [UserService],
})
export class UserModule {}
