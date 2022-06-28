import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { networkInterfaces } from 'os'

@Entity()
export class Post {
	@PrimaryKey()
	id!: number

	@Property({ type: 'date' })
	createdAt = new Date()

	@Property({ type: 'date', onUpdate: () => new Date() })
	updatedAt = new Date()

	@Property({ type: 'date' })
	title!: string
}
