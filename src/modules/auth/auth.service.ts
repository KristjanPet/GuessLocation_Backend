import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'entities/user.entity'
import Logging from 'library/Logging'
import { UserModule } from 'modules/user/user.module'
import { compareHash, hash } from 'utils/bcrypt'
import { RegisterUserDto } from './dto/register-user.dto'
import { JwtPayload } from 'interfaces/JwtPayload.interface'
import { UserService } from 'modules/user/user.service'

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

  // async user(cookie: string): Promise<User> {
  //   Logging.warn("do sem pride")
  //   Logging.info(cookie)
  //   const data = await this.jwtService.verifyAsync(cookie)
  //   return this.meService.findById(data['id'])
  // }

  async user(cookie: string): Promise<User> {
    const decoded: JwtPayload = this.jwtService.decode(cookie) as JwtPayload
    // const decoded: any = this.jwtService.decode(cookie) as any;
    // console.log(decoded);

    return this.userService.findById(decoded.sub)
  }
}
