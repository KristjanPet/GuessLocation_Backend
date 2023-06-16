import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ActionType, ComponentType } from 'entities/log.entity'

export class CreateLogDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  action: ActionType

  @ApiProperty({ required: false })
  @IsOptional()
  component: ComponentType

  @ApiProperty({ required: false })
  @IsOptional()
  new_value: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  url: string
}
