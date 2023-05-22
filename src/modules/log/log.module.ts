import { Module, forwardRef } from '@nestjs/common'
import { LogService } from './log.service'
import { LogController } from './log.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from 'entities/log.entity'
import { AuthService } from 'modules/auth/auth.service'
import { JwtService } from '@nestjs/jwt'
import { UserModule } from 'modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Log]), forwardRef(() => UserModule)],
  controllers: [LogController],
  providers: [LogService, AuthService, JwtService],
  exports: [LogService],
})
export class LogModule {}
