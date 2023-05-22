import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  forwardRef,
} from '@nestjs/common'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { Public } from 'decorators/public.decorator'
import { Request, Response } from 'express'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import { Location } from 'entities/location.entity'
import { LogService } from './log.service'
import { CreateLogDto } from './dto/create-log.dto'
import { Log } from 'entities/log.entity'

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
    @Req() req: Request,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    const cookie = req.cookies['access_token']
    return await this.logService.findAllPaginated(cookie, page, take)
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
