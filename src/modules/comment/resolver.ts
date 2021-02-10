import { PrismaClient } from '@prisma/client';
import { Length } from 'class-validator';
import {
  Arg,
  Args,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Publisher,
  PubSub,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';
import { Comment, User, Post } from '@generated/type-graphql';

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
class CommentResolver {
  constructor() {}

  @Subscription({
    topics: 'COMMENTS',
    // subscribe: () =>
  })
  newComment(@Root() payload: Comment): Comment {
    return payload;
  }

  @Mutation(returns => Comment)
  async createComment(
    @Arg('data') newCommentData: NewCommentInput,
    @Ctx('prisma') prisma: PrismaClient,
    @PubSub('COMMENTS') publish: Publisher<Comment>,
  ) {
    const comment = await prisma.comment.create({
      data: {
        ...newCommentData,
      },
    });
    await publish(comment);
    return comment;
  }

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

export default CommentResolver;
