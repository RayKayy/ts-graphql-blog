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
} from 'type-graphql';
import { MaxLength, Length, Min, Max } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { Comment, User, Post } from '@generated/type-graphql';

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

@InputType()
class UpdateUserInput {
  @Field()
  @MaxLength(30)
  name?: string;

  @Field()
  @Length(1, 255)
  email?: string;

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(99)
  age?: number;
}

@singleton()
@Resolver(of => User)
class UserResolver {
  constructor() {}

  // Queries
  @Query(returns => String)
  async hello() {
    return 'World';
  }

  @Query(returns => User)
  async user(@Arg('id') userId: number, @Ctx('prisma') prisma: PrismaClient) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  @Mutation(returns => User)
  async createUser(
    @Arg('data') newUserData: NewUserInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const user = await prisma.user.create({
      data: {
        ...newUserData,
      },
    });
    return user;
  }

  // Mutations
  @Mutation(returns => User)
  async updateUser(
    @Arg('id') userId: number,
    @Arg('data') updateData: UpdateUserInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updateData,
      },
    });
    return user;
  }

  @Mutation(returns => User)
  async deleteUser(
    @Arg('id') userId: number,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return user;
  }

  // Field Resolvers
  @FieldResolver(returns => [Post])
  async posts(@Root() user: User, @Ctx('prisma') prisma: PrismaClient) {
    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
    });
    return posts;
  }

  @FieldResolver(returns => [Comment])
  async comments(@Root() user: User, @Ctx('prisma') prisma: PrismaClient) {
    const comments = await prisma.comment.findMany({
      where: { authorId: user.id },
    });
    return comments;
  }
}

export default UserResolver;
