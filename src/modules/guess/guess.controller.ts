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
import { CreateGuessDto } from './dto/create-guess.dto'

@ApiTags('Guess')
@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  //GET

  @ApiCreatedResponse({ description: 'List all guesses by user sorted by distance.' })
  @ApiBadRequestResponse({ description: 'Error getting list of guesses' })
  @Get(':id/user')
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('id') userId: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    return await this.guessService.findByUserId(userId, page, take)
  }

  @ApiCreatedResponse({ description: 'List all guesses by user sorted by distance.' })
  @ApiBadRequestResponse({ description: 'Error getting list of guesses' })
  @Get(':id/location')
  @HttpCode(HttpStatus.OK)
  async findByLocationId(
    @Param('id') locationId: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    return await this.guessService.findByLocationId(locationId, page, take)
  }

  //POST

  @ApiCreatedResponse({ description: 'Create guess.' })
  @ApiBadRequestResponse({ description: 'Error for creating guess' })
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('id') locationId: string,
    @Body() createGuessDto: CreateGuessDto,
    @Req() req: Request,
  ): Promise<Guess> {
    const cookie = req.cookies['access_token']
    return await this.guessService.create(locationId, createGuessDto, cookie)
  }
}
