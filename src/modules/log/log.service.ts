import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Log } from 'entities/log.entity'
import { User } from 'entities/user.entity'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { AuthService } from 'modules/auth/auth.service'
import { AbstractService } from 'modules/common/abstract.service'
import { UserService } from 'modules/user/user.service'
import { Repository } from 'typeorm'

import { CreateLogDto } from './dto/create-log.dto'

@Injectable()
export class LogService extends AbstractService<Log> {
  constructor(
    @InjectRepository(Log) private readonly logRepository: Repository<Log>,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    super(logRepository)
  }

  async findAllPaginated(userId: string, page: number, take: number): Promise<PaginatedResult> {
    try {
      const user: User = await this.userService.findById(userId)
      if (user.admin) {
        return await this.paginate(page, take, ['user'], { created_at: 'DESC' })
      } else {
        Logging.error('This user do not have premission to see logs.')
        throw new InternalServerErrorException('This user do not have premission to see logs.')
      }
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all logs')
    }
  }

  async create(createLogDto: CreateLogDto, cookie: string): Promise<Log> {
    try {
      const user = await this.authService.user(cookie)

      const log = this.logRepository.create({ user: user, ...createLogDto })
      return this.logRepository.save(log)
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException('something went wrong while creating a new log')
    }
  }
}
