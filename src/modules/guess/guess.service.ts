import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Guess } from 'entities/guess.entity'
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
      return await this.paginateByAuthor(
        userId,
        page,
        take,
        ['user', 'location'],
        { distance: 'ASC' },
        { user: { id: userId } },
      )
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
    }
  }

  async findByLocationId(locationId: string, page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginateByAuthor(
        locationId,
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
      const distance = 2000

      const guess = this.guessRepository.create({ location, user, ...createGuessDto, distance })
      return this.guessRepository.save(guess)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('something went wrong while creating a new guess')
    }
  }

  async paginateByAuthor(
    userId: string,
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
}
