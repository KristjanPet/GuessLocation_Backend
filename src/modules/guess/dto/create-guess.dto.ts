import { IsNotEmpty, IsOptional } from 'class-validator'
import { Match } from 'decorators/match.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateGuessDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  lon: number

  @ApiProperty({ required: true })
  @IsNotEmpty()
  lat: number
}
