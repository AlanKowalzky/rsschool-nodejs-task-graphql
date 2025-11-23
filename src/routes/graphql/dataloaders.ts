import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export const createDataLoaders = (prisma: PrismaClient) => {
  const userLoader = new DataLoader(async (userIds: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
    });
    
    const userMap = new Map(users.map(user => [user.id, user]));
    return userIds.map(id => userMap.get(id) || null);
  });

  const postLoader = new DataLoader(async (postIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { id: { in: [...postIds] } },
    });
    
    const postMap = new Map(posts.map(post => [post.id, post]));
    return postIds.map(id => postMap.get(id) || null);
  });

  const profileLoader = new DataLoader(async (profileIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { id: { in: [...profileIds] } },
    });
    
    const profileMap = new Map(profiles.map(profile => [profile.id, profile]));
    return profileIds.map(id => profileMap.get(id) || null);
  });

  const profileByUserIdLoader = new DataLoader(async (userIds: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...userIds] } },
    });
    
    const profileMap = new Map(profiles.map(profile => [profile.userId, profile]));
    return userIds.map(id => profileMap.get(id) || null);
  });

  const memberTypeLoader = new DataLoader(async (memberTypeIds: readonly string[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: [...memberTypeIds] } },
    });
    
    const memberTypeMap = new Map(memberTypes.map(mt => [mt.id, mt]));
    return memberTypeIds.map(id => memberTypeMap.get(id) || null);
  });

  const postsByAuthorLoader = new DataLoader(async (authorIds: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: [...authorIds] } },
    });
    
    const postsByAuthor = new Map<string, any[]>();
    authorIds.forEach(id => postsByAuthor.set(id, []));
    
    posts.forEach(post => {
      const authorPosts = postsByAuthor.get(post.authorId) || [];
      authorPosts.push(post);
      postsByAuthor.set(post.authorId, authorPosts);
    });
    
    return authorIds.map(id => postsByAuthor.get(id) || []);
  });

  const subscribersLoader = new DataLoader(async (authorIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { authorId: { in: [...authorIds] } },
      include: { subscriber: true },
    });
    
    const subscribersByAuthor = new Map<string, any[]>();
    authorIds.forEach(id => subscribersByAuthor.set(id, []));
    
    subscriptions.forEach(sub => {
      const authorSubs = subscribersByAuthor.get(sub.authorId) || [];
      authorSubs.push(sub.subscriber);
      subscribersByAuthor.set(sub.authorId, authorSubs);
    });
    
    return authorIds.map(id => subscribersByAuthor.get(id) || []);
  });

  const subscriptionsLoader = new DataLoader(async (subscriberIds: readonly string[]) => {
    const subscriptions = await prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: { in: [...subscriberIds] } },
      include: { author: true },
    });
    
    const subscriptionsBySubscriber = new Map<string, any[]>();
    subscriberIds.forEach(id => subscriptionsBySubscriber.set(id, []));
    
    subscriptions.forEach(sub => {
      const subscriberSubs = subscriptionsBySubscriber.get(sub.subscriberId) || [];
      subscriberSubs.push(sub.author);
      subscriptionsBySubscriber.set(sub.subscriberId, subscriberSubs);
    });
    
    return subscriberIds.map(id => subscriptionsBySubscriber.get(id) || []);
  });

  return {
    userLoader,
    postLoader,
    profileLoader,
    profileByUserIdLoader,
    memberTypeLoader,
    postsByAuthorLoader,
    subscribersLoader,
    subscriptionsLoader,
  };
};