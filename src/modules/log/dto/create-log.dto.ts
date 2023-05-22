import { IsNotEmpty, IsOptional } from 'class-validator'
import { Match } from 'decorators/match.decorator'
import { ApiProperty } from '@nestjs/swagger'
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
