import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomUUID } from 'crypto'
import { User } from 'entities/user.entity'
import { JwtPayload } from 'interfaces/JwtPayload.interface'
import Logging from 'library/Logging'
import { UserService } from 'modules/user/user.service'
import SibApiV3Sdk from 'sib-api-v3-sdk'
import { compareHash, hash } from 'utils/bcrypt'

import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

// const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    Logging.info('Validating user...')

    const user = await this.userService.findBy({ email: email })
    if (!user) {
      throw new BadRequestException('Invalida credentials')
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalida credentials')
    }

    Logging.info('User is valid.')
    return user
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const user = await this.userService.findBy({ email: registerUserDto.email })
    if (user) {
      throw new BadRequestException('Email already used')
    }
    Logging.info(`Registrira uporanbika: ${registerUserDto.email}`)
    const hashedPassword: string = await hash(registerUserDto.password)
    return await this.userService.create({
      ...registerUserDto,
      password: hashedPassword,
    })
  }

  async generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email })
  }

  async user(cookie: string): Promise<User> {
    const decoded: JwtPayload = this.jwtService.decode(cookie) as JwtPayload
    // const decoded: any = this.jwtService.decode(cookie) as any;
    // console.log(decoded);

    return this.userService.findById(decoded.sub)
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ msg: string }> {
    const user = await this.userService.findBy({ email: forgotPasswordDto.email })
    if (!user) {
      throw new InternalServerErrorException('User not found')
    }
    user.token = randomUUID()

    const apiKey = defaultClient.authentications['api-key']
    apiKey.apiKey = process.env.EMAIL_API_KEY

    const url = `${process.env.FRONTEND_URL}/reset_password?token=${user.token}`
    const text = `Clik this ${url} to reset password`

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    const sender = {
      email: 'noreply@geotagger.com',
      name: 'GeoTagger',
    }
    const recivers = [
      {
        email: forgotPasswordDto.email,
      },
    ]

    try {
      await apiInstance.sendTransacEmail({
        sender,
        to: recivers,
        subject: 'Password reset',
        textContent: text,
        htmlContent: `<html><head></head><body>${text}</body></html>`,
      })
      await this.userService.updateUser(user)
      return { msg: 'Reset link send' }
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('something went wrong while sending an email')
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const user = await this.userService.findBy({ token: resetPasswordDto.token })
    if (!user) {
      throw new InternalServerErrorException('Can not find this user')
    }

    const hashedPassword: string = await hash(resetPasswordDto.password)
    user.password = hashedPassword
    user.token = null
    return await this.userService.updateUser(user)
  }
}
