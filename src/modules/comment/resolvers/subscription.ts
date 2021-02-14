import { PrismaClient } from '@prisma/client';
import { Arg, Ctx, Resolver, Root, Subscription } from 'type-graphql';
import { Comment } from '@generated/type-graphql';

@Resolver(Comment)
class CommentSubscriptionResolver {
  @Subscription({
    topics: ({ args, payload, context }) => `POST:${args.postId}:COMMENTS`,
  })
  comment(
    @Arg('postId') _postId: Number,
    @Root() payload: Comment,
    @Ctx('prisma') prisma: PrismaClient,
  ): Comment {
    return payload;
  }
}

export default CommentSubscriptionResolver;
