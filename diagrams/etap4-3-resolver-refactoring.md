# Etap 4.3: Refaktoryzacja resolvers do DataLoader

```mermaid
flowchart TD
    A[Resolver Refactoring] --> B[User resolvers update]
    B --> C[Profile resolvers update]
    C --> D[Context modification]
    D --> E[DataLoader integration]
    
    B --> B1["PRZED:<br/>profile: async (parent, args, context) => {<br/>  return context.prisma.profile.findUnique({<br/>    where: { userId: parent.id }<br/>  })<br/>}"]
    
    B --> B2["PO:<br/>profile: async (parent, args, context) => {<br/>  return context.loaders.profileByUserIdLoader.load(parent.id)<br/>}"]
    
    B --> B3["PRZED:<br/>posts: async (parent, args, context) => {<br/>  return context.prisma.post.findMany({<br/>    where: { authorId: parent.id }<br/>  })<br/>}"]
    
    B --> B4["PO:<br/>posts: async (parent, args, context) => {<br/>  return context.loaders.postsByAuthorLoader.load(parent.id)<br/>}"]
    
    C --> C1["PRZED:<br/>memberType: async (parent, args, context) => {<br/>  return context.prisma.memberType.findUnique({<br/>    where: { id: parent.memberTypeId }<br/>  })<br/>}"]
    
    C --> C2["PO:<br/>memberType: async (parent, args, context) => {<br/>  return context.loaders.memberTypeLoader.load(parent.memberTypeId)<br/>}"]
    
    D --> D1["Context update:<br/>const loaders = createDataLoaders(prisma)<br/>const context = { prisma, loaders }"]
    
    E --> E1["Wszystkie resolvers używają loaders<br/>Batch loading automatyczny<br/>Cache per request<br/>Wydajność O(1) zamiast O(N)"]
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style B1 fill:#ffebee
    style B2 fill:#e8f5e8
    style C1 fill:#ffebee
    style C2 fill:#e8f5e8
```

## Szczegółowa refaktoryzacja resolvers:

### 1. User Type Resolvers

**User.profile (PRZED → PO):**
```typescript
// PRZED (N+1 problem)
profile: {
  type: Profile,
  resolve: async (parent, args, context) => {
    return context.prisma.profile.findUnique({
      where: { userId: parent.id },  // ❌ N queries
    });
  },
}

// PO (DataLoader)
profile: {
  type: Profile,
  resolve: async (parent, args, context) => {
    return context.loaders.profileByUserIdLoader.load(parent.id);  // ✅ Batched
  },
}
```

**User.posts (PRZED → PO):**
```typescript
// PRZED (N+1 problem)
posts: {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
  resolve: async (parent, args, context) => {
    return context.prisma.post.findMany({
      where: { authorId: parent.id },  // ❌ N queries
    });
  },
}

// PO (DataLoader)
posts: {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
  resolve: async (parent, args, context) => {
    return context.loaders.postsByAuthorLoader.load(parent.id);  // ✅ Batched
  },
}
```

**User.userSubscribedTo (PRZED → PO):**
```typescript
// PRZED (N+1 problem)
userSubscribedTo: {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
  resolve: async (parent, args, context) => {
    const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
      where: { subscriberId: parent.id },  // ❌ N queries
      include: { author: true },
    });
    return subscriptions.map(sub => sub.author);
  },
}

// PO (DataLoader)
userSubscribedTo: {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
  resolve: async (parent, args, context) => {
    return context.loaders.subscriptionsLoader.load(parent.id);  // ✅ Batched
  },
}
```

### 2. Profile Type Resolvers

**Profile.memberType (PRZED → PO):**
```typescript
// PRZED (N+1 problem)
memberType: {
  type: new GraphQLNonNull(MemberType),
  resolve: async (parent, args, context) => {
    return context.prisma.memberType.findUnique({
      where: { id: parent.memberTypeId },  // ❌ N queries
    });
  },
}

// PO (DataLoader)
memberType: {
  type: new GraphQLNonNull(MemberType),
  resolve: async (parent, args, context) => {
    return context.loaders.memberTypeLoader.load(parent.memberTypeId);  // ✅ Batched
  },
}
```

### 3. Context Modification

**index.ts update:**
```typescript
// PRZED
async handler(req) {
  const { query, variables } = req.body;
  const context = { prisma };  // ❌ Tylko prisma
  
  return graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,
    validationRules: [depthLimit(5)],
  } as any);
}

// PO
async handler(req) {
  const { query, variables } = req.body;
  const loaders = createDataLoaders(prisma);  // ✅ Nowe loaders per request
  const context = { prisma, loaders };
  
  return graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,
    validationRules: [depthLimit(5)],
  } as any);
}
```

### 4. Kluczowe zmiany
- **Direct Prisma calls** → **DataLoader.load() calls**
- **Individual queries** → **Batch loading**
- **Context expansion** → **{ prisma, loaders }**
- **Per-request loaders** → **Fresh cache per request**

### 5. Performance impact
- **Query reduction**: O(N) → O(1)
- **Automatic batching**: DataLoader handles grouping
- **Caching**: Duplicate requests cached per request
- **Maintained functionality**: Same results, better performance

**Cel**: Eliminacja N+1 problem przy zachowaniu funkcjonalności