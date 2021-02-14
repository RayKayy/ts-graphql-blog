import { singleton } from 'tsyringe';
import { Resolver, Query, Arg, Ctx, FieldResolver, Root } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { Comment, User, Post } from '@generated/type-graphql';

@singleton()
@Resolver(of => User)
class UserQueryResolver {
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

export default UserQueryResolver;
