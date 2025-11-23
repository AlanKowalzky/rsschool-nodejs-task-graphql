# Etap 2.1: Implementacja Query Resolvers

```mermaid
flowchart TD
    A[Query Resolvers Implementation] --> B[MemberType Queries]
    B --> C[User Queries]
    C --> D[Post Queries]
    D --> E[Profile Queries]
    
    B --> B1["memberTypes: {<br/>  type: NonNull List NonNull MemberType,<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.memberType.findMany()<br/>  }<br/>}"]
    
    B --> B2["memberType: {<br/>  type: MemberType,<br/>  args: { id: { type: NonNull MemberTypeIdEnum } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.memberType.findUnique({<br/>      where: { id: args.id }<br/>    })<br/>  }<br/>}"]
    
    C --> C1["users: {<br/>  type: NonNull List NonNull User,<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.user.findMany()<br/>  }<br/>}"]
    
    C --> C2["user: {<br/>  type: User,<br/>  args: { id: { type: NonNull UUIDType } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.user.findUnique({<br/>      where: { id: args.id }<br/>    })<br/>  }<br/>}"]
    
    D --> D1["posts: {<br/>  type: NonNull List NonNull Post,<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.post.findMany()<br/>  }<br/>}"]
    
    D --> D2["post: {<br/>  type: Post,<br/>  args: { id: { type: NonNull UUIDType } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.post.findUnique({<br/>      where: { id: args.id }<br/>    })<br/>  }<br/>}"]
    
    E --> E1["profiles: {<br/>  type: NonNull List NonNull Profile,<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.profile.findMany()<br/>  }<br/>}"]
    
    E --> E2["profile: {<br/>  type: Profile,<br/>  args: { id: { type: NonNull UUIDType } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.profile.findUnique({<br/>      where: { id: args.id }<br/>    })<br/>  }<br/>}"]
    
    style A fill:#e3f2fd
    style E2 fill:#c8e6c9
    style B1 fill:#fff3e0
    style C1 fill:#f3e5f5
    style D1 fill:#e8f5e8
```

## Szczegółowy opis Query Resolvers:

### 1. MemberType Queries
- **memberTypes**: Zwraca wszystkie typy członkostwa z bazy
- **memberType(id)**: Zwraca konkretny typ członkostwa po ID
- **Prisma calls**: `findMany()`, `findUnique({ where: { id } })`

### 2. User Queries  
- **users**: Zwraca wszystkich użytkowników
- **user(id)**: Zwraca konkretnego użytkownika po UUID
- **Prisma calls**: `findMany()`, `findUnique({ where: { id } })`

### 3. Post Queries
- **posts**: Zwraca wszystkie posty
- **post(id)**: Zwraca konkretny post po UUID
- **Prisma calls**: `findMany()`, `findUnique({ where: { id } })`

### 4. Profile Queries
- **profiles**: Zwraca wszystkie profile
- **profile(id)**: Zwraca konkretny profil po UUID
- **Prisma calls**: `findMany()`, `findUnique({ where: { id } })`

### 5. Wzorce implementacji
- **List queries**: Bez argumentów, `findMany()`
- **Single queries**: Argument `id`, `findUnique({ where: { id } })`
- **Return types**: List queries → NonNull List, Single → Nullable
- **Context usage**: `context.prisma` dla dostępu do bazy

**Cel**: Podstawowe CRUD read operations dla wszystkich typów