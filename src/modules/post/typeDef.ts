import { Field, ID, ObjectType } from 'type-graphql';
import User from '../user/typeDef';
import Comment from '../comment/typeDef';

@ObjectType()
class Post {
  @Field(type => ID)
  id!: number;

  @Field()
  title!: string;

  @Field(type => String, { nullable: true })
  content!: string;

  @Field()
  published!: boolean;

  authorId!: number;

  @Field(type => User)
  author?: User;

  @Field(type => [Comment], { nullable: true })
  comments?: Comment[];
}

export default Post;
