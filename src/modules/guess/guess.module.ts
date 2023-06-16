import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Guess } from 'entities/guess.entity'
import { AuthService } from 'modules/auth/auth.service'
import { LocationModule } from 'modules/location/location.module'
import { UserModule } from 'modules/user/user.module'

import { GuessController } from './guess.controller'
import { GuessService } from './guess.service'

@Module({
  imports: [TypeOrmModule.forFeature([Guess]), UserModule, LocationModule],
  controllers: [GuessController],
  providers: [GuessService, AuthService, JwtService],
  exports: [GuessService],
})
export class GuessModule {}
