# Etap 2: Implementacja resolvers dla queries i mutations

```mermaid
flowchart TD
    A[Start Etapu 2] --> B[Implementacja Query resolvers]
    B --> C[Implementacja Mutation resolvers]
    C --> D[Dodanie relation resolvers]
    D --> E[Integracja z Prisma]
    E --> F[Obsługa błędów]
    F --> G[Testowanie]
    G --> H[Commit Etapu 2]
    
    B --> B1[memberTypes/memberType]
    B --> B2[users/user]
    B --> B3[posts/post]
    B --> B4[profiles/profile]
    
    C --> C1[Create mutations]
    C --> C2[Change mutations]
    C --> C3[Delete mutations]
    C --> C4[Subscription mutations]
    
    D --> D1[User.profile resolver]
    D --> D2[User.posts resolver]
    D --> D3[User subscriptions resolvers]
    D --> D4[Profile.memberType resolver]
    
    E --> E1[prisma.user.findMany()]
    E --> E2[prisma.post.create()]
    E --> E3[prisma.profile.update()]
    E --> E4[prisma.subscribersOnAuthors]
    
    style A fill:#e3f2fd
    style H fill:#c8e6c9
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#e8f5e8
```

## Kluczowe komponenty Etapu 2:

### 1. Query Resolvers (8)
- **memberTypes**: `prisma.memberType.findMany()`
- **memberType(id)**: `prisma.memberType.findUnique()`
- **users**: `prisma.user.findMany()`
- **user(id)**: `prisma.user.findUnique()`
- **posts**: `prisma.post.findMany()`
- **post(id)**: `prisma.post.findUnique()`
- **profiles**: `prisma.profile.findMany()`
- **profile(id)**: `prisma.profile.findUnique()`

### 2. Mutation Resolvers (11)
- **Create (3)**: createUser, createProfile, createPost
- **Change (3)**: changeUser, changeProfile, changePost
- **Delete (3)**: deleteUser, deleteProfile, deletePost
- **Subscriptions (2)**: subscribeTo, unsubscribeFrom

### 3. Relation Resolvers (5)
- **User.profile**: `prisma.profile.findUnique({ where: { userId } })`
- **User.posts**: `prisma.post.findMany({ where: { authorId } })`
- **User.userSubscribedTo**: Subscription logic
- **User.subscribedToUser**: Subscription logic
- **Profile.memberType**: `prisma.memberType.findUnique()`

### 4. Prisma Integration
- Wszystkie operacje CRUD przez Prisma Client
- Proper error handling
- Transaction support dla complex operations