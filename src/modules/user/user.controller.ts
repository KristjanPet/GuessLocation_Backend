import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger/dist/index'
import { User } from 'entities/user.entity'
import { Request } from 'express'
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'helpers/imageStorage'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import { AuthService } from 'modules/auth/auth.service'
import { LocationService } from 'modules/location/location.service'
import { join } from 'path'

import { CreateUserDto } from './Dto/create-user.dto'
import { UpdateUserDto } from './Dto/update-user.dto'
import { UserService } from './user.service'

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

  @ApiCreatedResponse({ description: 'List of users locations.' })
  @ApiBadRequestResponse({ description: 'Error for users locations' })
  @Get('/location')
  @HttpCode(HttpStatus.OK)
  async findByUser(
    // @Param('id') userId: string,
    @Req() req: Request,
    @Query('page') page: number,
    @Query('take') take: number,
  ): Promise<PaginatedResult> {
    const cookie = req.cookies['access_token']
    const user = (await this.authService.user(cookie)) as User
    return await this.locationService.findByUserPaginated(user.id, page, take)
  }

  @ApiCreatedResponse({ description: 'Get one user.' })
  @ApiBadRequestResponse({ description: 'Error getting one user' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id, [])
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
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.userService.updateUserImageId(id, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
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
    const user = (await this.authService.user(cookie)) as User
    return this.userService.update(user, updateUserDto)
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
