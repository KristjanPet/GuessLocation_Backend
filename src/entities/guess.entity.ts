import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Base } from './base.entity'
import { User } from './user.entity'
import { Location } from './location.entity'

@Entity()
export class Guess extends Base {
  @Column({})
  lon: number

  @Column({})
  lat: number

  @Column({})
  distance: number

  @ManyToOne(() => User, (user) => user.guesses)
  @JoinColumn({ name: 'userId' })
  user: User

  @ManyToOne(() => Location, (location) => location.guesses)
  @JoinColumn({ name: 'locationId' })
  location: Location
}
