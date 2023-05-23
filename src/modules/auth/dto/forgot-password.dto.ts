// import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ForgotPasswordDto {
  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string
}
