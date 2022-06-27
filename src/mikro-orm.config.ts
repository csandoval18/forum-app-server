import { Post } from './entities/Post'
import { __prod__ } from './constants'
import { MikroORM } from '@mikro-orm/core'

export default {
	entities: [Post],
	dbName: 'forum',
	user: 'Christian',
	password: 'root',
	type: 'postgresql',
	debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]
