import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { Public } from 'decorators/public.decorator'
import { Log } from 'entities/log.entity'
import { Request } from 'express'
import { PaginatedResult } from 'interfaces/paginated-result.interface'

import { CreateLogDto } from './dto/create-log.dto'
import { LogService } from './log.service'

@ApiTags('Log')
@Controller('log')
@UseInterceptors(ClassSerializerInterceptor)
export class LogController {
  constructor(private readonly logService: LogService) {}

  //GET

  @ApiCreatedResponse({ description: 'List of latest logs.' })
  @ApiBadRequestResponse({ description: 'Error for list of logs' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('userId') userId: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    return await this.logService.findAllPaginated(userId, page, take)
  }

  //POST

  @ApiCreatedResponse({ description: 'Create log.' })
  @ApiBadRequestResponse({ description: 'Error for creating log' })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createLogDto: CreateLogDto, @Req() req: Request): Promise<Log> {
    const cookie = req.cookies['access_token']
    return await this.logService.create(createLogDto, cookie)
  }
}
