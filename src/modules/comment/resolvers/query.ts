import { PrismaClient } from '@prisma/client';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Comment, User, Post } from '@generated/type-graphql';

@Resolver(Comment)
class CommentQueryResolver {
  @FieldResolver(returns => User)
  async author(@Root() comment: Comment, @Ctx('prisma') prisma: PrismaClient) {
    const user = prisma.user.findUnique({
      where: {
        id: comment.authorId,
      },
    });
    return user;
  }

  @FieldResolver(returns => Post)
  async post(@Root() comment: Comment, @Ctx('prisma') prisma: PrismaClient) {
    const post = prisma.post.findUnique({
      where: {
        id: comment.postId,
      },
    });
    return post;
  }
}

export default CommentQueryResolver;
