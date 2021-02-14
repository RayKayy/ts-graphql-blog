import { inject, singleton } from 'tsyringe';
import {
  Resolver,
  Arg,
  Mutation,
  InputType,
  Ctx,
  Field,
  Int,
  PubSub,
  Publisher,
} from 'type-graphql';
import { MaxLength, Length } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { Post } from '@generated/type-graphql';

import { PostSubscriptionPayload } from './subscription';

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
class PostMutationResolver {
  // Mutations
  @Mutation(returns => Post)
  async createPost(
    @Arg('data') newPostData: NewPostInput,
    @PubSub('POSTS') publish: Publisher<PostSubscriptionPayload>,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const post = await prisma.post.create({
      data: {
        ...newPostData,
      },
    });
    await publish({ data: post, mutation: 'CREATED' });
    return post;
  }
}

export default PostMutationResolver;
