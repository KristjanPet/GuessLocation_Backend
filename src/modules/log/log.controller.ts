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

@ApiTags('Log')
@Controller('log')
@UseInterceptors(ClassSerializerInterceptor)
export class LogController {
  constructor(private readonly logService: LogService) {}

  //GET

  @ApiCreatedResponse({ description: 'List of latest locations.' })
  @ApiBadRequestResponse({ description: 'Error for list of locations' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number, @Query('take') take: number): Promise<PaginatedResult> {
    return await this.logService.findAllPaginated(page, take)
  }
}
