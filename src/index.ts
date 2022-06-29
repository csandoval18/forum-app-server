import 'reflect-metadata'
import { MikroORM, RequiredEntityData } from '@mikro-orm/core'
import { __prod__ } from './constants'
import microConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { Post } from './entities/Post'

const main = async () => {
	const orm = await MikroORM.init(microConfig)
	await orm.getMigrator().up()

	//adds record to postgres post table in forum DB
	// const post = orm.em.fork({}).create(Post, {
	// 	title: 'my first post',
	// } as RequiredEntityData<Post>)
	// await orm.em.persistAndFlush(post)

	const app = express()

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, PostResolver],
			validate: false,
		}),
		//function that returns an object for the context.
		//context can take req and res object from express
		context: () => ({ em: orm.em }),
	})

	await apolloServer.start()
	apolloServer.applyMiddleware({ app })

	app.listen(4000, () => {
		console.log('server started on localhost:4000')
	})
}

main().catch((err) => {
	console.error(err)
})
