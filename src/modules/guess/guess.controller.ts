import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { Public } from 'decorators/public.decorator'
import { Request, Response } from 'express'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import { GuessService } from './guess.service'
import { Guess } from 'entities/guess.entity'

@ApiTags('Guess')
@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  @ApiCreatedResponse({ description: 'List all guesses by user sorted by distance.' })
  @ApiBadRequestResponse({ description: 'Error getting list of guesses' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('id') userId: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    return await this.guessService.findByUserId(userId, page, take)
  }
}
