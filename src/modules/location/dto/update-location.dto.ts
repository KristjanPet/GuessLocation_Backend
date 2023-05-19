import { IsNotEmpty, IsOptional } from 'class-validator'
import { Match } from 'decorators/match.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateLocationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  avatar: string
}
