import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Guess } from 'entities/guess.entity'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { AuthService } from 'modules/auth/auth.service'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'

@Injectable()
export class GuessService extends AbstractService {
  constructor(
    @InjectRepository(Guess) private readonly guessRepository: Repository<Guess>,
    private readonly authService: AuthService,
  ) {
    super(guessRepository)
  }

  async findByUserId(userId: string, page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginateByAuthor(userId, page, take, ['author', 'guesses'], { distance: 'ASC' })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
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
