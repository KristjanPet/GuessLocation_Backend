import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm'
import { Base } from './base.entity'
import { User } from './user.entity'

export enum ActionType {
  CLICK = 'click',
  SCROLL = 'scroll',
  INPUT = 'input',
}

export enum ComponentType {
  LINK = 'link',
  BUTTON = 'button',
  INPUT = 'input',
  DROPDOWN = 'dropdown',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
}

@Entity()
export class Log extends Base {
  @Column({ nullable: false })
  action: ActionType

  @Column({ nullable: true })
  component: ComponentType

  @Column({ nullable: true })
  new_value: string

  @Column({ nullable: false })
  url: string

  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn({ name: 'userId' })
  user: User
}
