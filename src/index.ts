import { MikroORM } from '@mikro-orm/core'

const main = async () => {
	const orm = await MikroORM.init({
		dbName: 'forum',
		user: 'Christian',
		password: 'root',
		type: 'postgresql',
		debug: process.env.NODE_ENV !== 'production',
	})
}

console.log('hello there')
