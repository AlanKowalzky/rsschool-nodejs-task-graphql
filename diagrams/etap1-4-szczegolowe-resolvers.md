# Etap 1.4: Szczegółowa struktura resolvers.ts

```mermaid
flowchart TD
    A[Rozpoczęcie resolvers.ts] --> B[Import dependencies]
    B --> C[RootQueryType structure]
    C --> D[Mutations structure]
    
    B --> B1["GraphQLObjectType, GraphQLList<br/>GraphQLNonNull, GraphQLString<br/>UUIDType<br/>All types from ./types.js"]
    
    C --> C1["memberTypes:<br/>type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType)))<br/>// Resolver w etapie 2"]
    C --> C2["memberType:<br/>type: MemberType<br/>args: { id: { type: new GraphQLNonNull(MemberTypeIdEnum) } }<br/>// Resolver w etapie 2"]
    C --> C3["users:<br/>type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User)))<br/>// Resolver w etapie 2"]
    C --> C4["user:<br/>type: User<br/>args: { id: { type: new GraphQLNonNull(UUIDType) } }<br/>// Resolver w etapie 2"]
    C --> C5["posts, post, profiles, profile<br/>Analogiczna struktura<br/>// Resolvers w etapie 2"]
    
    D --> D1["createUser:<br/>type: new GraphQLNonNull(User)<br/>args: { dto: { type: new GraphQLNonNull(CreateUserInput) } }<br/>// Resolver w etapie 2"]
    D --> D2["createProfile, createPost:<br/>Analogiczna struktura<br/>// Resolvers w etapie 2"]
    D --> D3["changeUser, changePost, changeProfile:<br/>args: { id: UUID, dto: ChangeInput }<br/>// Resolvers w etapie 2"]
    D --> D4["deleteUser, deletePost, deleteProfile:<br/>type: new GraphQLNonNull(GraphQLString)<br/>args: { id: { type: new GraphQLNonNull(UUIDType) } }<br/>// Resolvers w etapie 2"]
    D --> D5["subscribeTo, unsubscribeFrom:<br/>type: new GraphQLNonNull(GraphQLString)<br/>args: { userId: UUID, authorId: UUID }<br/>// Resolvers w etapie 2"]
    
    style A fill:#e3f2fd
    style D5 fill:#c8e6c9
    style C1 fill:#fff3e0
    style D1 fill:#f3e5f5
```

## Szczegółowy opis struktury resolvers:

### 1. RootQueryType (8 queries)
- **memberTypes**: Lista wszystkich typów członkostwa
- **memberType(id)**: Pojedynczy typ członkostwa po ID
- **users**: Lista wszystkich użytkowników  
- **user(id)**: Pojedynczy użytkownik po ID
- **posts**: Lista wszystkich postów
- **post(id)**: Pojedynczy post po ID
- **profiles**: Lista wszystkich profili
- **profile(id)**: Pojedynczy profil po ID

### 2. Mutations (11 mutations)
- **Create (3)**: createUser, createProfile, createPost
- **Change (3)**: changeUser, changeProfile, changePost  
- **Delete (3)**: deleteUser, deleteProfile, deletePost
- **Subscriptions (2)**: subscribeTo, unsubscribeFrom

### 3. Wzorce argumentów
- **List queries**: Bez argumentów
- **Single queries**: args: { id: NonNull UUID/MemberTypeId }
- **Create mutations**: args: { dto: NonNull CreateInput }
- **Change mutations**: args: { id: NonNull UUID, dto: NonNull ChangeInput }
- **Delete mutations**: args: { id: NonNull UUID }
- **Subscription mutations**: args: { userId: NonNull UUID, authorId: NonNull UUID }

### 4. Typy zwracane
- **List queries**: NonNull List NonNull Type
- **Single queries**: Nullable Type
- **Create/Change mutations**: NonNull Type
- **Delete/Subscription mutations**: NonNull String

**Cel**: Kompletna struktura resolvers gotowa na implementację