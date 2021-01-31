import { Field, ID, ObjectType } from 'type-graphql';
import User from '../user/User';
import Comment from '../comment/Comment';

@ObjectType()
class Post {
  @Field(type => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  body!: string;

  @Field()
  published!: boolean;

  @Field(type => User)
  author!: User;

  @Field(type => [Comment], { nullable: true })
  comments?: Comment[];
}

export default Post;
