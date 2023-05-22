import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Log } from 'entities/log.entity'
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
}
