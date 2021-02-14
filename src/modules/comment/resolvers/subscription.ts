import { PrismaClient } from '@prisma/client';
import {
  Arg,
  Field,
  ObjectType,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Comment } from '@generated/type-graphql';
import { inject } from 'tsyringe';

@ObjectType()
class CommentSubscriptionPayload {
  @Field()
  data!: Comment;

  @Field()
  mutation!: string;
}

@Resolver(Comment)
class CommentSubscriptionResolver {
  @Subscription({
    topics: ({ args, payload, context }) => `POST:${args.postId}:COMMENT`,
  })
  commentOnPost(
    @Arg('postId') _postId: Number,
    @Root() payload: CommentSubscriptionPayload,
  ): CommentSubscriptionPayload {
    return payload;
  }

  @Subscription({
    topics: 'COMMENT',
  })
  comment(
    @Root() payload: CommentSubscriptionPayload,
  ): CommentSubscriptionPayload {
    console.log(payload);
    return payload;
  }
}

export default CommentSubscriptionResolver;
