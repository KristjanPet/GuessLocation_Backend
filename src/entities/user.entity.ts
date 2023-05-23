import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Base } from './base.entity'
import { Location } from './location.entity'
import { Log } from './log.entity'
import { Guess } from './guess.entity'

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: false, default: false })
  admin: boolean

  @Column({ nullable: false })
  @Exclude()
  password: string

  @OneToMany(() => Log, (log) => log.user)
  logs: Log[]

  @OneToMany(() => Location, (location) => location.author)
  locations: Location[]

  @OneToMany(() => Guess, (guess) => guess.user)
  guesses: Guess[]

  @Column({ nullable: true, default: null })
  @Exclude()
  token: string
}
