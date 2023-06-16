import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { Base } from './base.entity'
import { Guess } from './guess.entity'
import { User } from './user.entity'

@Entity()
export class Location extends Base {
  @Column({ type: 'float' })
  lon: number

  @Column({ type: 'float' })
  lat: number

  @Column({ nullable: true })
  name: string

  @Column({})
  avatar: string

  @ManyToOne(() => User, (user) => user.locations)
  @JoinColumn({ name: 'authorId' })
  author: User

  @OneToMany(() => Guess, (guess) => guess.location)
  guesses: Guess[]
}
