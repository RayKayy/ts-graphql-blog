import { inject, singleton } from 'tsyringe';
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  InputType,
  Ctx,
  Field,
  Int,
  FieldResolver,
  Root,
  Args,
  Info,
} from 'type-graphql';
import Post from './Post';
import User from '../user/User';
import Db from '../../db';
import { MaxLength, Length, Min, Max } from 'class-validator';

@InputType()
class NewUserInput {
  @Field()
  @MaxLength(30)
  name!: string;

  @Field()
  @Length(1, 255)
  email!: string;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(99)
  age?: number;
}

@singleton()
@Resolver(of => Post)
class PostResolver {
  constructor(@inject(Db) private db: any) {}

  @Query(returns => User)
  async me() {
    return {
      id: 'abc123',
      name: 'Raymond',
      email: 'a@a.ca',
      age: 26,
    };
  }

  @Query(returns => User)
  async user(@Arg('id') userId: string, @Ctx('db') db: Db) {
    return db.USERS.find(({ id }) => userId === id);
  }

  @Mutation(returns => User)
  async createUser(
    @Arg('data') newUserData: NewUserInput,
    @Ctx('db') db: Db,
  ): Promise<User> {
    console.log(db);
    const user = {
      id: Math.random().toString(),
      ...newUserData,
      posts: [],
      comments: [],
    };
    db.USERS.push(user);
    return user;
  }

  @FieldResolver()
  async posts(@Root() user: User, @Ctx('db') db: Db) {
    console.log(user);
    return db.POSTS.filter(({ author }) => author === user.id);
  }
}

export default UserResolver;
