// import { ApiProperty } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class ForgotPasswordDto {
  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string
}
