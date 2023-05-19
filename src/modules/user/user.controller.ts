import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UploadedFile,
  BadRequestException,
  Req,
  Inject,
  forwardRef,
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from 'entities/user.entity'
import { CreateUserDto } from './Dto/create-user.dto'
import { UpdateUserDto } from './Dto/update-user.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'helpers/imageStorage'
import { join } from 'path'
import { Request, Response } from 'express'
import { AuthService } from 'modules/auth/auth.service'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { LocationService } from 'modules/location/location.service'
import { PaginatedResult } from 'interfaces/paginated-result.interface'

@ApiTags('User')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => LocationService))
    private readonly locationService: LocationService,
  ) {}

  // GET

  @ApiCreatedResponse({ description: 'List all users.' })
  @ApiBadRequestResponse({ description: 'Error for list of users' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @ApiCreatedResponse({ description: 'Get one user.' })
  @ApiBadRequestResponse({ description: 'Error getting one user' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id, ['quote'])
  }

  @ApiCreatedResponse({ description: 'List of users locations.' })
  @ApiBadRequestResponse({ description: 'Error for users locations' })
  @Get(':id/location')
  @HttpCode(HttpStatus.OK)
  async findByUser(
    @Param('id') userId: string,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    return await this.locationService.findByUserPaginated(userId, page, take)
  }

  //POST

  @ApiCreatedResponse({ description: 'Create a user.' })
  @ApiBadRequestResponse({ description: 'Error for creating a user' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @ApiCreatedResponse({ description: 'Upload avatar for user.' })
  @ApiBadRequestResponse({ description: 'Error uploading avatar for user' })
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(@UploadedFile() file: Express.Multer.File, @Param('id') id: string): Promise<User> {
    const filename = file.filename

    if (!filename) throw new BadRequestException('file must be png jpg or jpeg')

    const imageFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imageFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.userService.updateUserImageId(id, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match')
  }

  // PATCH

  // @ApiCreatedResponse({ description: 'Update users password.' })
  // @ApiBadRequestResponse({ description: 'Error updating users password' })
  // @Patch('/update-password')
  // @HttpCode(HttpStatus.OK)
  // async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request): Promise<User> {
  //   const cookie = req.cookies['access_token']
  //   return this.userService.update(cookie, updateUserDto)
  // }

  @ApiCreatedResponse({ description: 'Update users info.' })
  @ApiBadRequestResponse({ description: 'Error updating users info' })
  @Patch('/update-user')
  @HttpCode(HttpStatus.OK)
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: Request): Promise<User> {
    const cookie = req.cookies['access_token']
    return this.userService.update(cookie, updateUserDto)
  }

  // DELTE
  @ApiCreatedResponse({ description: 'Delete user.' })
  @ApiBadRequestResponse({ description: 'Error deleting user' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.remove(id)
  }
}
