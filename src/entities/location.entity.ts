import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Base } from './base.entity'
import { User } from './user.entity'
import { Guess } from './guess.entity'

@Entity()
export class Location extends Base {
  @Column({})
  lon: number

  @Column({})
  lat: number

  @Column({ nullable: true })
  name: string

  @Column({})
  avatar: string

  @ManyToOne(() => User, (user) => user.locations)
  @JoinColumn({ name: 'authorId' })
  user: User

  @OneToMany(() => Guess, (guess) => guess.location)
  guesses: Guess[]
}
