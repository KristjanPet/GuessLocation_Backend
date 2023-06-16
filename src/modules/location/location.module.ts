import { forwardRef, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Location } from 'entities/location.entity'
import { AuthService } from 'modules/auth/auth.service'
import { UserModule } from 'modules/user/user.module'

import { LocationController } from './location.controller'
import { LocationService } from './location.service'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), forwardRef(() => UserModule)],
  controllers: [LocationController],
  providers: [LocationService, AuthService, JwtService],
  exports: [LocationService],
})
export class LocationModule {}
