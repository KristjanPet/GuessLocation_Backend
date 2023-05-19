import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Guess } from 'entities/guess.entity'
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
}
