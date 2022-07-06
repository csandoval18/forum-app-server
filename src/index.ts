import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/posts'
import { UserResolver } from './resolvers/users'
import { MyContext } from './types/types'
const session = require('express-session')
let RedisStore = require('connect-redis')(session)

const main = async () => {
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up()

	const app = express()

	app.set('trust proxy', !__prod__)
	app.set('Access-Control-Allow-Origin', 'https://studio.apollographql.com')
	app.set('Access-Control-Allow-Credentials', true)

	const { createClient } = require('redis')
	let redisClient = createClient({ legacyMode: true })
	redisClient.connect().catch(console.error)

	app.use(
		session({
			name: 'qid',
			store: new RedisStore({ client: redisClient }),
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: 'none', //lax csrf
				secure: true, // __prod__
			},
			secret: 'keyboard cat',
			resave: false,
			saveUninitialized: false,
		}),
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver, UserResolver],
			validate: false,
		}),
		//function that returns an object for the context.
		//context can take req and res object from express
		context: ({ req, res }: MyContext): MyContext => ({ em: orm.em, req, res }),
	})

	await apolloServer.start()
	apolloServer.applyMiddleware({
		app,
		cors: { credentials: true, origin: 'https://studio.apollographql.com' },
	})

	app.listen(4000, () => {
		console.log('server started on localhost:4000')
	})
}

main().catch((err) => {
	console.error(err)
})
