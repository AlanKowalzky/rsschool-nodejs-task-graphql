# Etap 2.4: Implementacja Subscription Mutations

```mermaid
flowchart TD
    A[Subscription Mutations] --> B[subscribeTo]
    B --> C[unsubscribeFrom]
    
    B --> B1["subscribeTo: {<br/>  type: NonNull String,<br/>  args: {<br/>    userId: { type: NonNull UUIDType },<br/>    authorId: { type: NonNull UUIDType }<br/>  },<br/>  resolve: async (parent, args, context) => {<br/>    await context.prisma.subscribersOnAuthors.create({<br/>      data: {<br/>        subscriberId: args.userId,<br/>        authorId: args.authorId<br/>      }<br/>    })<br/>    return 'Subscription created successfully'<br/>  }<br/>}"]
    
    C --> C1["unsubscribeFrom: {<br/>  type: NonNull String,<br/>  args: {<br/>    userId: { type: NonNull UUIDType },<br/>    authorId: { type: NonNull UUIDType }<br/>  },<br/>  resolve: async (parent, args, context) => {<br/>    await context.prisma.subscribersOnAuthors.delete({<br/>      where: {<br/>        subscriberId_authorId: {<br/>          subscriberId: args.userId,<br/>          authorId: args.authorId<br/>        }<br/>      }<br/>    })<br/>    return 'Unsubscribed successfully'<br/>  }<br/>}"]
    
    B1 --> B2["Tworzy relację N:N<br/>User (subscriber) ↔ User (author)<br/>Przez junction table SubscribersOnAuthors<br/>Composite key: [subscriberId, authorId]"]
    
    C1 --> C2["Usuwa relację N:N<br/>Używa composite key do identyfikacji<br/>subscriberId_authorId: { subscriberId, authorId }<br/>Prisma composite key syntax"]
    
    style A fill:#e3f2fd
    style C fill:#c8e6c9
    style B1 fill:#fff3e0
    style C1 fill:#ffebee
    style B2 fill:#e8f5e8
```

## Szczegółowy opis Subscription Mutations:

### 1. subscribeTo Mutation
- **Purpose**: Tworzy subscription relationship między użytkownikami
- **Args**: `userId` (subscriber), `authorId` (author to follow)
- **Prisma call**: `subscribersOnAuthors.create()`
- **Data**: `{ subscriberId: userId, authorId: authorId }`
- **Return**: Success message string

### 2. unsubscribeFrom Mutation  
- **Purpose**: Usuwa subscription relationship
- **Args**: `userId` (subscriber), `authorId` (author to unfollow)
- **Prisma call**: `subscribersOnAuthors.delete()`
- **Where**: Composite key `subscriberId_authorId`
- **Return**: Success message string

### 3. SubscribersOnAuthors Model
```prisma
model SubscribersOnAuthors {
  subscriber   User   @relation("subscriber", fields: [subscriberId], references: [id])
  subscriberId String
  author       User   @relation("author", fields: [authorId], references: [id])
  authorId     String
  
  @@id([subscriberId, authorId])
}
```

### 4. Relacje w User Model
```prisma
model User {
  userSubscribedTo SubscribersOnAuthors[] @relation("subscriber")
  subscribedToUser SubscribersOnAuthors[] @relation("author")
}
```

### 5. Kluczowe aspekty
- **Junction table**: SubscribersOnAuthors łączy Users
- **Composite key**: `[subscriberId, authorId]` zapobiega duplikatom
- **Bidirectional**: User może być subscriber i author
- **Cascade**: `onDelete: Cascade` usuwa subscriptions gdy User jest usunięty

### 6. Error Handling
- **Duplicate subscription**: Prisma rzuca błąd unique constraint
- **Non-existent users**: Foreign key constraint violation
- **Self-subscription**: Możliwe (nie ma ograniczenia)
- **Already unsubscribed**: Prisma rzuca błąd record not found

### 7. GraphQL Schema Mapping
- **User.userSubscribedTo**: Authors które user followuje
- **User.subscribedToUser**: Subscribers którzy followują user
- **Resolvers**: Będą dodane w następnym kroku

**Cel**: Implementacja follow/unfollow functionality między użytkownikami