import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { Public } from 'decorators/public.decorator'
import { User } from 'entities/user.entity'
import { Request, Response } from 'express'
import { RequestWithUser } from 'interfaces/auth.interface'

import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { LocalAuthGuard } from './guards/local-auth.guard'

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor) //so that the password is excluded
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ description: 'Signup user.' })
  @ApiBadRequestResponse({ description: 'Error signigup user' })
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterUserDto): Promise<User> {
    // console.log(body)

    return this.authService.register(body)
  }

  @ApiCreatedResponse({ description: 'Login user.' })
  @ApiBadRequestResponse({ description: 'Error logging in' })
  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginUserDto })
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production' ? true : false,
      expires: new Date(Date.now() + 3600 * 1000 * 24 * 30 * 1),
    })
    return req.user
  }

  @ApiCreatedResponse({ description: 'Get logged in user.' })
  @ApiBadRequestResponse({ description: 'Error getting logedin user' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async user(@Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token']
    return this.authService.user(cookie)
  }

  @ApiCreatedResponse({ description: 'Forgot password.' })
  @ApiBadRequestResponse({ description: 'Error geting restart token' })
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<{ msg: string }> {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @ApiCreatedResponse({ description: 'Reset password.' })
  @ApiBadRequestResponse({ description: 'Error reseting password' })
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<User> {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @ApiCreatedResponse({ description: 'Signout user.' })
  @ApiBadRequestResponse({ description: 'Error signing out' })
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signout(@Res({ passthrough: true }) res: Response): Promise<{ msg: string }> {
    res.clearCookie('access_token')
    return { msg: 'Signout...' }
  }
}
