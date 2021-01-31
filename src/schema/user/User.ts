import { Field, ID, Int, ObjectType } from 'type-graphql';
import Post from '../post/Post';
import Comment from '../comment/Comment';

@ObjectType()
class User {
  @Field(type => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field(type => Int, { nullable: true })
  age?: number;

  @Field(type => [Post])
  posts?: Post[];

  @Field(type => [Comment])
  comments?: Comment[];
}

export default User;
