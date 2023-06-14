import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { AuthService } from 'modules/auth/auth.service'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'
import { CreateLocationDto } from './dto/create-location.dto'
import { Location } from 'entities/location.entity'
import { UpdateLocationDto } from './dto/update-location.dto'
import { User } from 'entities/user.entity'

@Injectable()
export class LocationService extends AbstractService {
  constructor(
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly authService: AuthService,
  ) {
    super(locationRepository)
  }

  async findAllPaginated(page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginate(page, take, ['author', 'guesses'], { created_at: 'DESC' })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
    }
  }

  async findByUserPaginated(userId: string, page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginateByAuthor(userId, page, take, ['author', 'guesses'], { created_at: 'DESC' })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
    }
  }

  async getRandomLocation(): Promise<Location> {
    try {
      const allLocations = await this.findAll(['author', 'guesses'])
      return allLocations[Math.floor(Math.random() * allLocations.length)]
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while getting a random location')
    }
  }

  async create(createLocationDto: CreateLocationDto, cookie: string): Promise<Location> {
    try {
      const user = await this.authService.user(cookie)

      const location = this.locationRepository.create({ author: user, ...createLocationDto })
      return this.locationRepository.save(location)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('something went wrong while creating a new location')
    }
  }

  async update(locationId: string, cookie: string, updateLocationDto: UpdateLocationDto): Promise<Location> {
    const user = (await this.authService.user(cookie)) as User
    const location = await this.findById(locationId, ['author'])

    if (location.author.id !== user.id) {
      throw new BadRequestException('No premission to update this location')
    }
    location.avatar = updateLocationDto.avatar

    try {
      this.locationRepository.update(locationId, location)
      return location
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while updating location')
    }
  }

  async paginateByAuthor(
    userId: string,
    page = 1,
    take: number,
    relations = [],
    order?: Record<string, 'ASC' | 'DESC'>,
  ): Promise<PaginatedResult> {
    try {
      const [data, total] = await this.repository.findAndCount({
        where: { author: { id: userId } },
        take,
        skip: (page - 1) * take,
        relations,
        order,
      })

      return {
        data: data,
        meta: {
          total,
          page,
        },
      }
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while searching for a paginated elements.')
    }
  }
}
