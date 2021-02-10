import 'reflect-metadata';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { resolvers } from '@generated/type-graphql';

// Custom Resolvers
import CustomUserResolver from './modules/user/resolver';
import CustomPostResolver from './modules/post/resolver';
import CustomCommentResolver from './modules/comment/resolver';

const app = Fastify();

const prisma = new PrismaClient();

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      // ...resolvers,
      // Uncomment to use Custom Resolvers Over Generated Resolvers
      CustomUserResolver,
      CustomPostResolver,
      CustomCommentResolver,
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
