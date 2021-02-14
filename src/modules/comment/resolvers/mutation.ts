import { PrismaClient } from '@prisma/client';
import { Length } from 'class-validator';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  PubSub,
  PubSubEngine,
  Resolver,
} from 'type-graphql';
import { Comment } from '@generated/type-graphql';
import { container, inject, singleton } from 'tsyringe';
import { INJECTABLES } from '../../../constants';

@InputType()
class NewCommentInput {
  @Field(type => Int)
  authorId!: number;

  @Field(type => Int)
  postId!: number;

  @Field()
  @Length(1, 255)
  body!: string;
}

@Resolver(Comment)
class CommentMutationResolver {
  @Mutation(returns => Comment)
  async createComment(
    @Arg('data') newCommentData: NewCommentInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    console.log(prisma);
    const comment = await prisma.comment.create({
      data: {
        ...newCommentData,
      },
    });
    await Promise.allSettled([
      pubSub.publish(`POST:${comment.postId}:COMMENT`, {
        data: comment,
        mutation: 'CREATE',
      }),
      pubSub.publish(`COMMENT`, {
        data: comment,
        mutation: 'CREATE',
      }),
    ]);
    return comment;
  }
}

export default CommentMutationResolver;
