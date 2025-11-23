# Etap 1: Analiza projektu i przygotowanie podstawowej struktury GraphQL

```mermaid
flowchart TD
    A[Start Etapu 1] --> B[Analiza REST API]
    B --> C[Przegląd schema.graphql]
    C --> D[Analiza Prisma models]
    D --> E[Mapowanie REST → GraphQL]
    
    E --> F[Utworzenie struktury plików]
    F --> G[types.ts - Podstawowe typy]
    G --> H[Implementacja UUID scalar]
    H --> I[Implementacja MemberType]
    I --> J[Implementacja User type]
    J --> K[Implementacja Post type]
    K --> L[Implementacja Profile type]
    
    L --> M[Implementacja Input types]
    M --> N[CreateUserInput]
    N --> O[ChangeUserInput]
    O --> P[CreatePostInput]
    P --> Q[ChangePostInput]
    Q --> R[CreateProfileInput]
    R --> S[ChangeProfileInput]
    
    S --> T[Przygotowanie resolvers.ts]
    T --> U[Struktura RootQueryType]
    U --> V[Struktura Mutations]
    V --> W[Aktualizacja index.ts]
    W --> X[Commit Etapu 1]
    
    style A fill:#e3f2fd
    style X fill:#c8e6c9
    style F fill:#fff3e0
    style M fill:#f3e5f5
    style T fill:#e8f5e8

    subgraph "Analiza"
        B1[REST endpoints<br/>GET /users → users query<br/>POST /users → createUser]
        B2[Prisma schema<br/>User, Post, Profile<br/>MemberType, Subscriptions]
        B3[Wymagany GraphQL schema<br/>Types, Inputs, Queries, Mutations]
    end
    
    subgraph "Struktura plików"
        F1[types.ts - GraphQL types]
        F2[resolvers.ts - Query/Mutation structure]
        F3[index.ts - Schema setup]
        F4[types/uuid.ts - UUID scalar]
    end
```

## Mapowanie REST → GraphQL:

### REST Endpoints → GraphQL Queries:
- `GET /users` → `users: [User!]!`
- `GET /users/:id` → `user(id: UUID!): User`
- `GET /posts` → `posts: [Post!]!`
- `GET /posts/:id` → `post(id: UUID!): Post`
- `GET /profiles` → `profiles: [Profile!]!`
- `GET /profiles/:id` → `profile(id: UUID!): Profile`
- `GET /member-types` → `memberTypes: [MemberType!]!`
- `GET /member-types/:id` → `memberType(id: MemberTypeId!): MemberType`

### REST Endpoints → GraphQL Mutations:
- `POST /users` → `createUser(dto: CreateUserInput!): User!`
- `PATCH /users/:id` → `changeUser(id: UUID!, dto: ChangeUserInput!): User!`
- `DELETE /users/:id` → `deleteUser(id: UUID!): String!`
- `POST /posts` → `createPost(dto: CreatePostInput!): Post!`
- `PATCH /posts/:id` → `changePost(id: UUID!, dto: ChangePostInput!): Post!`
- `DELETE /posts/:id` → `deletePost(id: UUID!): String!`
- `POST /profiles` → `createProfile(dto: CreateProfileInput!): Profile!`
- `PATCH /profiles/:id` → `changeProfile(id: UUID!, dto: ChangeProfileInput!): Profile!`
- `DELETE /profiles/:id` → `deleteProfile(id: UUID!): String!`

### Dodatkowe mutations (subscriptions):
- `subscribeTo(userId: UUID!, authorId: UUID!): String!`
- `unsubscribeFrom(userId: UUID!, authorId: UUID!): String!`

## Cel Etapu 1:
Utworzenie kompletnej struktury typów GraphQL zgodnej ze schematem, bez implementacji resolverów. Przygotowanie fundamentu dla kolejnych etapów.