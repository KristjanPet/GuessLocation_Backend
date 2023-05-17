import { Exclude } from 'class-transformer'
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Base } from './base.entity'
import { User } from './user.entity'

@Entity()
export class Log extends Base {
  @Column({ nullable: false })
  action: string

  @Column({ nullable: true })
  component: string

  @Column({ nullable: true })
  new_value: string

  @Column({ nullable: false })
  url: string

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'userId' })
  user: User
}
