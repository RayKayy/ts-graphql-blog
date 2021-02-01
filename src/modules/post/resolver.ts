import { singleton } from 'tsyringe';
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
import Post from './typeDef';
import User from '../user/typeDef';
import { MaxLength, Length } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import Comment from '../comment/typeDef';

@InputType()
class NewPostInput {
  @Field()
  @MaxLength(30)
  title!: string;

  @Field()
  @Length(1, 255)
  content?: string;

  @Field()
  published!: boolean;

  @Field(type => Int)
  authorId!: number;
}

@singleton()
@Resolver(of => Post)
class PostResolver {
  constructor() {}

  // Queries
  @Query(returns => Post)
  async post(@Arg('id') postId: number, @Ctx('prisma') prisma: PrismaClient) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    return post;
  }

  @Query(returns => [Post])
  async postsByAuthor(
    @Arg('userId') userId: number,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
    });
    return posts;
  }

  // Mutations
  @Mutation(returns => Post)
  async createPost(
    @Arg('data') newPostData: NewPostInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const post = await prisma.post.create({
      data: {
        ...newPostData,
      },
    });
    return post;
  }

  @FieldResolver(returns => User)
  async author(@Root() post: Post, @Ctx('prisma') prisma: PrismaClient) {
    const user = prisma.user.findUnique({
      where: {
        id: post.authorId,
      },
    });
    return user;
  }

  @FieldResolver(returns => [Comment])
  async comments(@Root() post: Post, @Ctx('prisma') prisma: PrismaClient) {
    const comments = prisma.comment.findMany({
      where: {
        postId: post.id,
      },
    });
    return comments;
  }
}

export default PostResolver;
