import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LocationController } from './location.controller'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from 'modules/auth/auth.service'
import { LocationService } from './location.service'
import { Location } from 'entities/location.entity'
import { UserService } from 'modules/user/user.service'
import { UserModule } from 'modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Location]), forwardRef(() => UserModule)],
  controllers: [LocationController],
  providers: [LocationService, AuthService, JwtService],
  exports: [LocationService],
})
export class LocationModule {}
