import { Field, ID, ObjectType } from 'type-graphql';
import Post from '../post/Post';
import User from '../user/User';

@ObjectType()
class Comment {
  @Field(type => ID)
  id!: string;

  @Field()
  text!: string;

  @Field(type => Post)
  post!: Post;

  @Field(type => User)
  author!: User;
}

export default Comment;
