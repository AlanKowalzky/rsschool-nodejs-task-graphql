import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';
import { RootQueryType, Mutations } from './resolvers.js';
import { UUIDType } from './types/uuid.js';
import depthLimit from 'graphql-depth-limit';
import { createDataLoaders } from './dataloaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  // Tworzenie GraphQL Schema - struktura gotowa, resolvers w następnym etapie
  const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: Mutations,
    types: [UUIDType],
  });

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const loaders = createDataLoaders(prisma);
      const context = { prisma, loaders };
      
      return graphql({
        schema,
        source: query,
        variableValues: variables,
        contextValue: context,
        validationRules: [depthLimit(5)],
      } as any);
    },
  });
};

export default plugin;
