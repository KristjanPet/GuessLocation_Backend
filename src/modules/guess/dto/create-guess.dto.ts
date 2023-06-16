import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateGuessDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  lon: number

  @ApiProperty({ required: true })
  @IsNotEmpty()
  lat: number
}
