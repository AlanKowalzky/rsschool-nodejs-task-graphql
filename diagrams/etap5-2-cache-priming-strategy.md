# Etap 5.2: Cache Priming Strategy

```mermaid
flowchart TD
    A[Cache Priming Strategy] --> B[Problem Analysis]
    B --> C[Priming Implementation]
    C --> D[Cache Population]
    D --> E[DataLoader Integration]
    
    B --> B1["Problem:<br/>users query → DataLoader calls for subs<br/>Each user triggers separate loader calls<br/>Additional DB queries despite DataLoader"]
    
    B --> B2["Solution:<br/>Preload all data in users query<br/>Prime DataLoader cache with results<br/>Subsequent calls use cache, not DB"]
    
    C --> C1["primeUsersInCache(users, loaders)<br/>Prime user cache: userLoader.prime(id, user)<br/>Prime profile cache: profileByUserIdLoader.prime()<br/>Prime posts cache: postsByAuthorLoader.prime()"]
    
    C --> C2["Prime subscription caches:<br/>subscriptionsLoader.prime(userId, subscriptions)<br/>subscribersLoader.prime(userId, subscribers)<br/>All related data cached"]
    
    D --> D1["Cache population flow:<br/>1. Execute users query with includes<br/>2. Transform subscription data<br/>3. Prime all relevant caches<br/>4. Return users (cache populated)"]
    
    E --> E1["DataLoader behavior after priming:<br/>loader.load(id) → cache hit (no DB call)<br/>Batch loading still works for cache misses<br/>Best of both worlds: cache + batching"]
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style B1 fill:#ffebee
    style B2 fill:#e8f5e8
    style C1 fill:#fff3e0
```

## Szczegółowa cache priming strategy:

### 1. Problem bez cache priming
```typescript
// Query: { users { userSubscribedTo { name } } }

// Execution flow:
// 1. users query → returns 10 users
// 2. User.userSubscribedTo resolver calls subscriptionsLoader.load() for each user
// 3. DataLoader batches these calls → 1 DB query for subscriptions
// 4. Total: 2 DB queries (users + subscriptions)
```

### 2. Solution z cache priming
```typescript
// Query: { users { userSubscribedTo { name } } }

// Execution flow:
// 1. users query with conditional includes → returns users + subscriptions
// 2. Prime cache with loaded data
// 3. User.userSubscribedTo resolver calls subscriptionsLoader.load()
// 4. DataLoader returns from cache (no DB call)
// 5. Total: 1 DB query (users with includes)
```

### 3. Cache Priming Implementation
```typescript
const primeUsersInCache = async (users: any[], loaders: any) => {
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
```

### 4. Users Query z Cache Priming
```typescript
users: {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
  resolve: async (parent, args, context, info) => {
    const includeSubscriptions = shouldIncludeSubscriptions(info);
    
    const includeOptions: any = {
      profile: {
        include: {
          memberType: true,
        },
      },
      posts: true,
    };
    
    if (includeSubscriptions) {
      includeOptions.userSubscribedTo = {
        include: { author: true },
      };
      includeOptions.subscribedToUser = {
        include: { subscriber: true },
      };
    }
    
    const users = await context.prisma.user.findMany({
      include: includeOptions,
    });
    
    // Transform subscription data
    const transformedUsers = users.map(user => ({
      ...user,
      userSubscribedTo: user.userSubscribedTo?.map((sub: any) => sub.author) || [],
      subscribedToUser: user.subscribedToUser?.map((sub: any) => sub.subscriber) || [],
    }));
    
    // Prime cache with loaded data
    await primeUsersInCache(transformedUsers, context.loaders);
    
    return transformedUsers;
  },
}
```

### 5. Performance Benefits
- **Query reduction**: 2 queries → 1 query
- **Cache efficiency**: Subsequent calls use cache
- **Smart loading**: Conditional includes based on requested fields
- **Zero redundancy**: No duplicate DB calls

### 6. Cache Behavior
- **Cache hit**: `loader.load(id)` returns immediately from cache
- **Cache miss**: `loader.load(id)` falls back to batch loading
- **Per-request**: Fresh cache per GraphQL request
- **Automatic**: No manual cache management needed

**Cel**: Optimal performance przez intelligent cache priming