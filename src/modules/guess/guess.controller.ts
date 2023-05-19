import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { GuessService } from './guess.service'

@ApiTags('Guess')
@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}
}
