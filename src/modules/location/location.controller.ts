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
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { LocationService } from './location.service'
import { JwtAuthGuard } from 'modules/auth/guards/jwt.guard'
import { Public } from 'decorators/public.decorator'
import { Request, Response } from 'express'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import { CreateLocationDto } from './dto/create-location.dto'
import { Location } from 'entities/location.entity'
import { UpdateLocationDto } from './dto/update-location.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'helpers/imageStorage'
import { join } from 'path'

@ApiTags('Location')
@Controller('location')
@UseInterceptors(ClassSerializerInterceptor)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  //GET

  @ApiCreatedResponse({ description: 'List of latest locations.' })
  @ApiBadRequestResponse({ description: 'Error for list of locations' })
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number, @Query('take') take: number): Promise<PaginatedResult> {
    return await this.locationService.findAllPaginated(page, take)
  }

  @ApiCreatedResponse({ description: 'Random location.' })
  @ApiBadRequestResponse({ description: 'Error for random location' })
  @Get('/random')
  @HttpCode(HttpStatus.OK)
  async findRandom(): Promise<Location> {
    return await this.locationService.getRandomLocation()
  }

  @ApiCreatedResponse({ description: 'Get location by id.' })
  @ApiBadRequestResponse({ description: 'Error getting location' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<Location> {
    return await this.locationService.findById(id, ['author'])
  }

  // POST

  @ApiCreatedResponse({ description: 'Create location.' })
  @ApiBadRequestResponse({ description: 'Error for creating location' })
  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createLocationDto: CreateLocationDto, @Req() req: Request): Promise<Location> {
    const cookie = req.cookies['access_token']
    return await this.locationService.create(createLocationDto, cookie)
  }

  @ApiCreatedResponse({ description: 'Upload avatar for location.' })
  @ApiBadRequestResponse({ description: 'Error uploading avatar for location' })
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Location> {
    const filename = file?.filename
    const location = await this.locationService.findById(id)

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')
    const updateLocationDto: UpdateLocationDto = { avatar: filename }

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (location.avatar) {
      const oldFullImagePath = join(imagesFolderPath + '/' + location.avatar)
      console.warn(`${oldFullImagePath} is removed`)
      removeFile(oldFullImagePath)
    }
    const cookie = req.cookies['access_token']

    if (await isFileExtensionSafe(fullImagePath)) {
      return this.locationService.update(id, cookie, updateLocationDto)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  }

  // PATCH

  @ApiCreatedResponse({ description: 'Update users info.' })
  @ApiBadRequestResponse({ description: 'Error updating users info' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Req() req: Request,
  ): Promise<Location> {
    const cookie = req.cookies['access_token']
    return this.locationService.update(id, cookie, updateLocationDto)
  }

  // DELTE
  @ApiCreatedResponse({ description: 'Delete user.' })
  @ApiBadRequestResponse({ description: 'Error deleting user' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<Location> {
    return this.locationService.remove(id)
  }
}
