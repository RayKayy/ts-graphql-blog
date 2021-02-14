import 'reflect-metadata';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';

// Custom Resolvers
import {
  PostQueryResolver,
  PostMutationResolver,
  PostSubscriptionResolver,
} from './modules/post/resolvers';
import {
  CommentQueryResolver,
  CommentMutationResolver,
  CommentSubscriptionResolver,
} from './modules/comment/resolvers';
import {
  UserQueryResolver,
  UserMutationResolver,
} from './modules/user/resolvers';

const app = Fastify();

const prisma = new PrismaClient();

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      PostQueryResolver,
      PostMutationResolver,
      PostSubscriptionResolver,
      CommentQueryResolver,
      CommentMutationResolver,
      CommentSubscriptionResolver,
      UserQueryResolver,
      UserMutationResolver,
    ],
  });

  app.register(mercurius, {
    schema,
    context: (req, reply) => {
      return {
        req,
        reply,
        prisma,
      };
    },
    subscription: true,
    graphiql: 'playground',
  });

  app.get('/', async function (req, reply) {
    return reply.send('Server Up');
  });

  const serverUrl = await app.listen(4000);

  console.log(`
Server Running on: ${serverUrl}
GraphQL API Endpoint: ${serverUrl}/graphql
GraphQL Playground: ${serverUrl}/playground
  `);
};

main().finally(async () => {
  await prisma.$disconnect();
});
