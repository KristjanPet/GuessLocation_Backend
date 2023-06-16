import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { Repository } from 'typeorm'

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations = []): Promise<T[]> {
    try {
      return this.repository.find({ relations })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for all')
    }
  }

  async findBy(condition, relations = []): Promise<T> {
    try {
      return this.repository.findOne({
        where: condition,
        relations,
      })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for one')
    }
  }

  async findById(id: string, relations = []): Promise<T> {
    try {
      const element = await this.repository.findOne({
        where: { id },
        relations,
      })
      if (!element) {
        throw new BadRequestException(`Cannot find elemnt with id: ${id}`)
      }

      return element
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('something went wrong while searching for Id')
    }
  }

  async remove(id: string): Promise<T> {
    const element = await this.findById(id)
    try {
      return this.repository.remove(element)
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Something went wrong while deleting an element')
    }
  }

  async paginate(
    page = 1,
    take: number,
    relations = [],
    order?: Record<string, 'ASC' | 'DESC'>,
  ): Promise<PaginatedResult> {
    try {
      const [data, total] = await this.repository.findAndCount({
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
