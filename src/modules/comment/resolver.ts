import { PrismaClient } from '@prisma/client';
import { Length } from 'class-validator';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';
import Comment from './typeDef';

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

  @Mutation(returns => Comment)
  async createComment(
    @Arg('data') newCommentData: NewCommentInput,
    @Ctx('prisma') prisma: PrismaClient,
  ) {
    const comment = await prisma.comment.create({
      data: {
        ...newCommentData,
      },
    });
    return comment;
  }

  @FieldResolver()
  async author(@Root() comment: Comment, @Ctx('prisma') prisma: PrismaClient) {
    const user = prisma.user.findUnique({
      where: {
        id: comment.authorId,
      },
    });
    return user;
  }

  @FieldResolver()
  async post(@Root() comment: Comment, @Ctx('prisma') prisma: PrismaClient) {
    const user = prisma.post.findUnique({
      where: {
        id: comment.postId,
      },
    });
    return user;
  }
}

export default CommentResolver;
