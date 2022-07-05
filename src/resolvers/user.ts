import { User } from '../entities/User'
import { MyContext } from '../types'
import {
	Resolver,
	Arg,
	Mutation,
	InputType,
	Field,
	Ctx,
	ObjectType,
} from 'type-graphql'
import { RequiredEntityData } from '@mikro-orm/core'
//argon2 is for hashing password and making it secure in case the DB is compromised
import argon2 from 'argon2'

//input types are used for arguments
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string
	@Field()
	password: string
}

@ObjectType()
class FieldError {
	@Field()
	field: string
	@Field()
	message: string
}

//object types can be returned from mutations
@ObjectType()
class UserResponse {
	//error returned if query did not work
	@Field(() => [FieldError], { nullable: true })
	//question mark returns undefined
	errors?: FieldError[]

	//user returns if query worked properly
	@Field(() => User, { nullable: true })
	user?: User
}

@Resolver()
export class UserResolver {
	//register handling
	@Mutation(() => UserResponse)
	async register(
		//options is an object with containing the username and password as parameter fields
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em }: MyContext,
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [
					{
						field: 'username',
						message: 'length must be greater tha 2',
					},
				],
			}
		}

		if (options.password.length <= 3) {
			return {
				errors: [
					{
						field: 'username',
						message: 'length must be greater tha 3',
					},
				],
			}
		}
		const hashsedPassword = await argon2.hash(options.password)
		const user = em.fork({}).create(User, {
			username: options.username,
			password: hashsedPassword,
		} as RequiredEntityData<User>)

		//querie to check if username already is already taken
		const usernameTaken = await em.findOne(User, { username: options.username })
		if (!usernameTaken) {
			await em.persistAndFlush(user)
			return { user }
		} else {
			console.log('Hello')
			return {
				errors: [
					{
						field: 'username',
						message: 'Username already taken.',
					},
				],
			}
		}
	}

	//login handling
	@Mutation(() => UserResponse)
	async login(
		@Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
		@Ctx() { em }: MyContext,
	): Promise<UserResponse> {
		//querie for row containing data of user
		const user = await em.findOne(User, { username: options.username })
		if (!user) {
			return {
				errors: [
					{
						field: 'username',
						message: "that username doesn't exist",
					},
				],
			}
		}
		const valid = await argon2.verify(user.password, options.password)
		if (!valid) {
			return {
				errors: [
					{
						field: 'password',
						message: 'incorrect password',
					},
				],
			}
		}
		return {
			user,
		}
	}
}
