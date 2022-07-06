import { Posts } from './entities/Posts'
import { __prod__ } from './constants'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'
import { Users } from './entities/Users'

export default {
	migrations: {
		path: path.join(__dirname, './migrations'),
		pattern: /^[\w-]+\d+\.[tj]s$/,
	},
	entities: [Posts, Users],
	dbName: 'forum',
	user: 'Christian',
	password: 'root',
	type: 'postgresql',
	debug: !__prod__,
	allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0]
// ^ sets type to first parameter accepted type for MikroORM.init() function in index.ts
