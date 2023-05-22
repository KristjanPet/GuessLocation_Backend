import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Log } from 'entities/log.entity'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { AuthService } from 'modules/auth/auth.service'
import { AbstractService } from 'modules/common/abstract.service'
import { Repository } from 'typeorm'

@Injectable()
export class LogService extends AbstractService {
  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
    private readonly authService: AuthService,
  ) {
    super(logRepository)
  }

  async findAllPaginated(page: number, take: number): Promise<PaginatedResult> {
    try {
      return await this.paginate(page, take, ['user'], { created_at: 'DESC' })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all locations')
    }
  }
}
