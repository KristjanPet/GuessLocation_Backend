import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateLocationDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  lon: number

  @ApiProperty({ required: true })
  @IsNotEmpty()
  lat: number

  @ApiProperty({ required: false })
  @IsOptional()
  name: string

  @ApiProperty({ required: true })
  @IsOptional()
  avatar: string
}
