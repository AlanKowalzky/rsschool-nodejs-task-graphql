import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

export const shouldIncludeSubscriptions = (info: GraphQLResolveInfo): boolean => {
  const parsedInfo = parseResolveInfo(info) as ResolveTree;
  
  if (!parsedInfo || !parsedInfo.fieldsByTypeName) {
    return false;
  }

  const userFields = parsedInfo.fieldsByTypeName.User;
  if (!userFields) {
    return false;
  }

  const hasUserSubscribedTo = !!userFields.userSubscribedTo;
  const hasSubscribedToUser = !!userFields.subscribedToUser;
  
  return hasUserSubscribedTo || hasSubscribedToUser;
};

export const primeUsersInCache = async (users: any[], loaders: any) => {
  // Prime user cache
  users.forEach(user => {
    loaders.userLoader.prime(user.id, user);
  });

  // Prime profile cache if profiles are included
  const profiles = users.filter(user => user.profile).map(user => user.profile);
  profiles.forEach(profile => {
    loaders.profileLoader.prime(profile.id, profile);
    loaders.profileByUserIdLoader.prime(profile.userId, profile);
  });

  // Prime posts cache if posts are included
  const allPosts = users.flatMap(user => user.posts || []);
  allPosts.forEach(post => {
    loaders.postLoader.prime(post.id, post);
  });

  // Prime posts by author cache
  users.forEach(user => {
    if (user.posts) {
      loaders.postsByAuthorLoader.prime(user.id, user.posts);
    }
  });

  // Prime subscription caches if subscriptions are included
  users.forEach(user => {
    if (user.userSubscribedTo) {
      loaders.subscriptionsLoader.prime(user.id, user.userSubscribedTo);
    }
    if (user.subscribedToUser) {
      loaders.subscribersLoader.prime(user.id, user.subscribedToUser);
    }
  });
};