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
import User from './User';
import Post from '../post/Post';
import Db from '../../db';
import { MaxLength, Length, Min, Max } from 'class-validator';
import { PrismaClient } from '@prisma/client';

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
@Resolver(of => User)
class UserResolver {
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
    @Ctx('prisma') prisma: PrismaClient,
  ): Promise<User> {
    const user = await prisma.user.create({
      data: {
        ...newUserData,
      },
    });
    return user;
  }

  @FieldResolver()
  async posts(@Root() user: User, @Ctx('prisma') prisma: PrismaClient) {
    console.log(user);
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
    });
    return posts;
  }
}

export default UserResolver;
