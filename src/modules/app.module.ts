import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { configValidationSchema } from 'config/schema.config'
import { LoggerMiddleware } from 'middleware/logger.middleware'
import { DatabaseModule } from './database/database.module'
import { UserModule } from './user/user.module'
import { LocationModule } from './location/location.module'
import { GuessModule } from './guess/guess.module'
import { LogModule } from './log/log.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    LocationModule,
    GuessModule,
    LogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
