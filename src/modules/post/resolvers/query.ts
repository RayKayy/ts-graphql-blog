import { singleton } from 'tsyringe';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { Comment, User, Post } from '@generated/type-graphql';

@singleton()
@Resolver(of => Post)
class PostQueryResolver {
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

export default PostQueryResolver;
