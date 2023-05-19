import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Guess } from 'entities/guess.entity'
import { GuessController } from './guess.controller'
import { GuessService } from './guess.service'
import { AuthService } from 'modules/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserModule } from 'modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Guess]), UserModule],
  controllers: [GuessController],
  providers: [GuessService, AuthService, JwtService],
  exports: [GuessService],
})
export class GuessModule {}
