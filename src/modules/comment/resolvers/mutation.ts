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
    @Ctx('prisma') prisma: PrismaClient,
    @PubSub() pubSub: PubSubEngine,
  ) {
    const comment = await prisma.comment.create({
      data: {
        ...newCommentData,
      },
    });
    await pubSub.publish(`POST:${comment.postId}:COMMENTS`, comment);
    return comment;
  }
}

export default CommentMutationResolver;
