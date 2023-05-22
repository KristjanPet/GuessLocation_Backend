import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Guess } from 'entities/guess.entity'
import { Location } from 'entities/location.entity'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { AuthService } from 'modules/auth/auth.service'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'
import { CreateGuessDto } from './dto/create-guess.dto'
import { LocationService } from 'modules/location/location.service'

@Injectable()
export class GuessService extends AbstractService {
  constructor(
    @InjectRepository(Guess) private readonly guessRepository: Repository<Guess>,
    private readonly authService: AuthService,
    private readonly locationService: LocationService,
  ) {
    super(guessRepository)
  }

  async findByUserId(userId: string, page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginateById(page, take, ['user', 'location'], { distance: 'ASC' }, { user: { id: userId } })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
    }
  }

  async findByLocationId(locationId: string, page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginateById(
        page,
        take,
        ['user', 'location'],
        { distance: 'ASC' },
        { location: { id: locationId } },
      )
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
    }
  }

  async create(locationId: string, createGuessDto: CreateGuessDto, cookie: string): Promise<Guess> {
    try {
      const user = await this.authService.user(cookie)
      const location = await this.locationService.findById(locationId)
      const distance = await this.calcCrow(location.lat, location.lon, createGuessDto.lat, createGuessDto.lon)

      const guess = this.guessRepository.create({ location, user, ...createGuessDto, distance })
      return this.guessRepository.save(guess)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('something went wrong while creating a new guess')
    }
  }

  async paginateById(
    page = 1,
    take: number,
    relations = [],
    order?: Record<string, 'ASC' | 'DESC'>,
    where?: Record<string, Record<string, string>>,
  ): Promise<PaginatedResult> {
    try {
      const [data, total] = await this.repository.findAndCount({
        // where: { user: { id: userId } },
        where,
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

  async calcCrow(lat1: number, lon1, lat2: number, lon2) {
    var R = 6371 // km
    var dLat = await this.toRad(lat2 - lat1)
    var dLon = await this.toRad(lon2 - lon1)
    var lat1: number = await this.toRad(lat1)
    var lat2 = await this.toRad(lat2)

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d
  }

  // Converts numeric degrees to radians
  async toRad(Value) {
    return (Value * Math.PI) / 180
  }
}
