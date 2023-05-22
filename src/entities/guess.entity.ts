import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, JoinColumn, OneToMany, Double } from 'typeorm'
import { Base } from './base.entity'
import { User } from './user.entity'
import { Location } from './location.entity'

@Entity()
export class Guess extends Base {
  @Column({ type: 'float' })
  lon: number

  @Column({ type: 'float' })
  lat: number

  @Column({ type: 'float' })
  distance: number

  @ManyToOne(() => User, (user) => user.guesses)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Location, (location) => location.guesses)
  @JoinColumn({ name: 'locationId' })
  location: Location
}
