# ts-graphql-blog
Repo to try out new tech stack: fastify, mercurius, typegraphql, prisma

## Developing
1. Have a running instance of PostgreSQL; Update the `.env` with the connection string for db.
2. `yarn` - Install Required Dependencies
3. `yarn prisma generate` - Generates `@prisma/client` and `@generated/type-graphql` dependencies based on the `schema.prisma` file.
4. `yarn dev` - Run Migrations on DB and start application using nodemon + ts-node

## GraphQL Playground
The `/playground` endpoint serves a GraphQL playground for testing out GraphQL requests.
## DB GUI
Running `yarn prisma studio` will start a server serving Prisma Studio, a GUI for the DB.
