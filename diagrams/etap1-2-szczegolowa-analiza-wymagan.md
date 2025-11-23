# Etap 1.2: Szczegółowa analiza wymagań

```mermaid
flowchart TD
    A[Start analizy] --> B[Przegląd schema.graphql]
    B --> C[Analiza REST endpoints]
    C --> D[Przegląd Prisma models]
    D --> E[Mapowanie REST→GraphQL]
    E --> F[Plan struktury plików]
    
    B --> B1["RootQueryType:<br/>memberTypes, memberType<br/>users, user<br/>posts, post<br/>profiles, profile"]
    B --> B2["Mutations:<br/>createUser, changeUser, deleteUser<br/>createPost, changePost, deletePost<br/>createProfile, changeProfile, deleteProfile<br/>subscribeTo, unsubscribeFrom"]
    B --> B3["Types:<br/>User, Post, Profile, MemberType<br/>UUID scalar, MemberTypeId enum"]
    B --> B4["Inputs:<br/>CreateUserInput, ChangeUserInput<br/>CreatePostInput, ChangePostInput<br/>CreateProfileInput, ChangeProfileInput"]
    
    C --> C1["Users REST:<br/>GET /users → users: [User!]!<br/>GET /users/:id → user(id: UUID!): User<br/>POST /users → createUser(dto: CreateUserInput!)<br/>PATCH /users/:id → changeUser(id, dto)<br/>DELETE /users/:id → deleteUser(id)"]
    C --> C2["Posts REST:<br/>GET /posts → posts: [Post!]!<br/>GET /posts/:id → post(id: UUID!): Post<br/>POST /posts → createPost(dto: CreatePostInput!)<br/>PATCH /posts/:id → changePost(id, dto)<br/>DELETE /posts/:id → deletePost(id)"]
    C --> C3["Profiles REST:<br/>GET /profiles → profiles: [Profile!]!<br/>GET /profiles/:id → profile(id: UUID!): Profile<br/>POST /profiles → createProfile(dto)<br/>PATCH /profiles/:id → changeProfile(id, dto)<br/>DELETE /profiles/:id → deleteProfile(id)"]
    C --> C4["MemberTypes REST:<br/>GET /member-types → memberTypes: [MemberType!]!<br/>GET /member-types/:id → memberType(id: MemberTypeId!)"]
    
    style A fill:#e3f2fd
    style F fill:#c8e6c9
    style B1 fill:#fff3e0
    style C1 fill:#f3e5f5
```

## Szczegółowy opis analizy:

### 1. Przegląd schema.graphql
- **RootQueryType**: 8 queries (memberTypes, memberType, users, user, posts, post, profiles, profile)
- **Mutations**: 11 mutations (3x create, 3x change, 3x delete, 2x subscription)
- **Types**: 4 główne typy obiektów + UUID scalar + enum
- **Inputs**: 6 input types dla operacji create/change

### 2. Mapowanie REST → GraphQL
- **Users**: 5 endpoints REST → 2 queries + 3 mutations
- **Posts**: 5 endpoints REST → 2 queries + 3 mutations  
- **Profiles**: 5 endpoints REST → 2 queries + 3 mutations
- **MemberTypes**: 2 endpoints REST → 2 queries (tylko read)
- **Subscriptions**: Brak REST → 2 mutations GraphQL

### 3. Identyfikacja relacji
- User ↔ Profile (1:1)
- User ↔ Post (1:N)
- Profile ↔ MemberType (N:1)
- User ↔ User (N:N subscriptions)

**Cel**: Precyzyjne zrozumienie wymagań i mapowanie funkcjonalności