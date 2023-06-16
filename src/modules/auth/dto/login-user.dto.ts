// import { ApiProperty } from '@nestjs/swagger'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginUserDto {
  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string

  // @ApiProperty({ required: true })
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string
}
