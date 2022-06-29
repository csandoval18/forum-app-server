import { Resolver, Query, Ctx, Arg, Int, Mutation } from 'type-graphql'
import { MyContext } from '../types'
import { Post } from '../entities/Post'
import { RequiredEntityData } from '@mikro-orm/core'

// Post queries to DB
@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {})
	}

	@Query(() => Post, { nullable: true })
	post(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: MyContext,
	): Promise<Post | null> {
		return em.findOne(Post, { id })
	}

	//Create a post
	@Mutation(() => Post, { nullable: true })
	async createPost(
		@Arg('title') title: string,
		@Ctx() { em }: MyContext,
	): Promise<Post | null> {
		//adds record to postgres post table in forum DB
		const post = em.fork({}).create(Post, { title } as RequiredEntityData<Post>)
		await em.persistAndFlush(post)
		return post
	}

	@Mutation(() => Post, { nullable: true })
	async updatePost(
		@Arg('id') id: number,
		@Arg('title', () => String, { nullable: true }) title: string,
		@Ctx() { em }: MyContext,
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id })
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
		await em.nativeDelete(Post, { id })
		return true
	}
}
