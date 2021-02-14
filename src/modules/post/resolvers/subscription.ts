import { singleton } from 'tsyringe';
import { Resolver, Field, Root, Subscription, ObjectType } from 'type-graphql';
import { Post } from '@generated/type-graphql';

@ObjectType()
export class PostSubscriptionPayload {
  @Field()
  data!: Post;

  @Field()
  mutation!: string;
}

@singleton()
@Resolver(of => Post)
class PostSubscriptionResolver {
  @Subscription({
    topics: 'POSTS',
    filter: ({ payload }) => payload.data.published,
  })
  post(@Root() payload: PostSubscriptionPayload): PostSubscriptionPayload {
    console.log(payload);
    return payload;
  }
}

export default PostSubscriptionResolver;
