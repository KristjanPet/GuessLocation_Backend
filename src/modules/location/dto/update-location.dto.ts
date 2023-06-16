import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateLocationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  avatar: string
}
