import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, Matches, ValidateIf } from 'class-validator'
import { Match } from 'decorators/match.decorator'

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  first_name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  last_name?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @ApiProperty({ required: false })
  avatar?: string

  @ValidateIf((o) => typeof o.password === 'string' && o.password.lenght > 0)
  @IsOptional()
  @ApiProperty({ required: false })
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  })
  password?: string

  @ValidateIf((o) => typeof o.confirm_password === 'string' && o.confirm_password.lenght > 0)
  @IsOptional()
  @ApiProperty({ required: false })
  @Match(UpdateUserDto, (field) => field.password, { message: 'Passwords must match' })
  confirm_password?: string
}
