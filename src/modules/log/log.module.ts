import { forwardRef, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from 'entities/log.entity'
import { AuthService } from 'modules/auth/auth.service'
import { UserModule } from 'modules/user/user.module'

import { LogController } from './log.controller'
import { LogService } from './log.service'

@Module({
  imports: [TypeOrmModule.forFeature([Log]), forwardRef(() => UserModule)],
  controllers: [LogController],
  providers: [LogService, AuthService, JwtService],
  exports: [LogService],
})
export class LogModule {}
