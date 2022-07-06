import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql'
import { MyContext } from '../types/types'
import { Posts } from '../entities/Posts'
import { RequiredEntityData } from '@mikro-orm/core'

// Post queries to DB
@Resolver()
export class PostResolver {
	@Query(() => [Posts])
	posts(@Ctx() { em }: MyContext): Promise<Posts[]> {
		return em.find(Posts, {})
	}

	@Query(() => Posts, { nullable: true })
	post(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: MyContext,
	): Promise<Posts | null> {
		return em.findOne(Posts, { id })
	}

	//Create a post
	@Mutation(() => Posts, { nullable: true })
	async createPost(
		@Arg('title') title: string,
		@Ctx() { em }: MyContext,
	): Promise<Posts | null> {
		//adds record to postgres post table in forum DB
		const post = em
			.fork({})
			.create(Posts, { title } as RequiredEntityData<Posts>)
		await em.persistAndFlush(post)
		return post
	}

	@Mutation(() => Posts, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('title', () => String, { nullable: true }) title: string,
		@Ctx() { em }: MyContext,
	): Promise<Posts | null> {
		const post = await em.findOne(Posts, { id })
		if (!post) {
			return null
		}
		if (typeof title !== 'undefined') {
			post.title = title
			await em.persistAndFlush(post)
		}
		return post
	}

	@Mutation(() => Boolean)
	async deletePost(
		@Arg('id') id: number,
		@Ctx() { em }: MyContext,
	): Promise<boolean> {
		await em.nativeDelete(Posts, { id })
		return true
	}
}
