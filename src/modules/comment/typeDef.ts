import { Field, ID, ObjectType } from 'type-graphql';
import Post from '../post/typeDef';
import User from '../user/typeDef';

@ObjectType()
class Comment {
  @Field(type => ID)
  id!: string;

  @Field()
  body!: string;

  @Field(type => Post)
  post!: Post;

  postId!: number;

  @Field(type => User)
  author!: User;

  authorId!: number;
}

export default Comment;
