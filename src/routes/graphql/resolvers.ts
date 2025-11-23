import { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from './types/uuid.js';
import {
  MemberType,
  MemberTypeIdEnum,
  User,
  Post,
  Profile,
  CreateUserInput,
  ChangeUserInput,
  CreatePostInput,
  ChangePostInput,
  CreateProfileInput,
  ChangeProfileInput,
} from './types.js';

// Struktura RootQueryType - resolvers będą dodane w następnym etapie
export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      // Resolver będzie dodany w etapie 2
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      // Resolver będzie dodany w etapie 2
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      // Resolver będzie dodany w etapie 2
    },
    user: {
      type: User,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      // Resolver będzie dodany w etapie 2
    },
    post: {
      type: Post,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      // Resolver będzie dodany w etapie 2
    },
    profile: {
      type: Profile,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
  },
});

// Struktura Mutations - resolvers będą dodane w następnym etapie
export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      // Resolver będzie dodany w etapie 2
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      // Resolver będzie dodany w etapie 2
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      // Resolver będzie dodany w etapie 2
    },
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      // Resolver będzie dodany w etapie 2
    },
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      // Resolver będzie dodany w etapie 2
    },
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      // Resolver będzie dodany w etapie 2
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      // Resolver będzie dodany w etapie 2
    },
  },
});