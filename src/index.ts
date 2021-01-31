import 'reflect-metadata';
import Fastify from 'fastify';
import mercurius from 'mercurius';
import { container } from 'tsyringe';
import { buildSchema } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import Db from './db';
import UserResolver from './schema/user/resolver';

const app = Fastify();

const prisma = new PrismaClient();

// Resolvers
// const resolvers = {
//   Comment: {
//     author(parent: any, args: any, ctx: any, info: any) {
//       return USERS.find(({ id }) => id === parent.author);
//     },
//     post(parent: any, args: any, ctx: any, info: any) {
//       return POSTS.find(({ id }) => id === parent.post);
//     },
//   },
//   Post: {
//     author(parent: any, args: any, ctx: any, info: any) {
//       return USERS.find(({ id }) => id === parent.author);
//     },
//     comments(parent: any, args: any, ctx: any, info: any) {
//       return COMMENTS.filter(({ post }) => post === parent.id);
//     },
//   },
//   User: {
//     posts(parent: any, args: any, ctx: any, info: any) {
//       return POSTS.filter(({ author }) => author === parent.id);
//     },
//     comments(parent: any, args: any, ctx: any, info: any) {
//       return COMMENTS.filter(({ author }) => author === parent.id);
//     },
//   },
//   Query: {
//     comments(parent: any, args: any, ctx: any, info: any) {
//       return COMMENTS;
//     },
//     posts(parent: any, args: any, ctx: any, info: any) {
//       if (args.query) {
//         return POSTS.filter(
//           ({ title, body }) =>
//             title.includes(args.query) || body.includes(args.query),
//         );
//       }
//       return POSTS;
//     },
//     users(parent: any, args: any, ctx: any, info: any) {
//       if (args.query) {
//         return USERS.filter(({ name }) =>
//           name.toLowerCase().includes(args.query),
//         );
//       }
//       return USERS;
//     },
//     me() {
//       return {
//         id: 'abc123',
//         name: 'Raymond',
//         email: 'a@a.ca',
//         age: 26,
//       };
//     },
//     post() {
//       return {
//         id: '234def',
//         title: 'The Bullet Journal Method',
//         body: 'Lalalalalala',
//         published: true,
//       };
//     },
//   },
//   Mutation: {
//     createUser(parent: any, args: any, ctx: any, info: any) {
//       const user = {
//         id: Math.random().toString(),
//         ...args.data,
//       };
//       USERS.push(user);
//       return user;
//     },
//     deleteUser(parent: any, args: any, ctx: any, info: any) {
//       const user = USERS.find(({ id }) => id === args.id);
//       if (!user) throw new Error('User Not Found');
//       POSTS.filter(({ author }) => author !== user.id);
//       COMMENTS.filter(({ author }) => author !== user.id);
//       return user;
//     },
//     createPost(parent: any, args: any, ctx: any, info: any) {
//       if (!USERS.some(({ id }) => id === args.author)) {
//         throw new Error('Author not found');
//       }
//       const post = {
//         id: Math.random().toString(),
//         ...args,
//       };
//       POSTS.push(post);
//       return post;
//     },
//     createComment(parent: any, args: any, ctx: any, info: any) {
//       if (!USERS.some(({ id }) => id === args.author)) {
//         throw new Error('Author not found');
//       } else if (
//         !POSTS.some(({ id, published }) => id === args.post && published)
//       ) {
//         throw new Error('Post not found');
//       }
//       const comment = {
//         id: Math.random().toString(),
//         ...args,
//       };
//       COMMENTS.push(comment);
//       return comment;
//     },
//   },
// };

const main = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  app.register(mercurius, {
    schema,
    context: (req, reply) => {
      return {
        db: container.resolve(Db),
        prisma,
      };
    },
    graphiql: 'playground',
  });

  app.get('/', async function (req, reply) {
    return reply.code(200);
    // return reply.graphql(query);
  });

  const res = await app.listen(4000);
  console.log(res);
};

main().finally(async () => {
  await prisma.$disconnect();
});
