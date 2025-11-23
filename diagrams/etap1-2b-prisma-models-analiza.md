# Etap 1.2b: Analiza modeli Prisma

```mermaid
flowchart TD
    A[Przegląd Prisma models] --> B[User model]
    B --> C[Post model]
    C --> D[Profile model]
    D --> E[MemberType model]
    E --> F[SubscribersOnAuthors model]
    F --> G[Mapowanie na GraphQL]
    
    B --> B1["User:<br/>id: String @id @default(uuid())<br/>name: String<br/>balance: Float<br/>profile: Profile?<br/>posts: Post[]<br/>userSubscribedTo: SubscribersOnAuthors[]<br/>subscribedToUser: SubscribersOnAuthors[]"]
    
    C --> C1["Post:<br/>id: String @id @default(uuid())<br/>title: String<br/>content: String<br/>author: User<br/>authorId: String"]
    
    D --> D1["Profile:<br/>id: String @id @default(uuid())<br/>isMale: Boolean<br/>yearOfBirth: Int<br/>user: User<br/>userId: String @unique<br/>memberType: MemberType<br/>memberTypeId: String"]
    
    E --> E1["MemberType:<br/>id: String @id<br/>discount: Float<br/>postsLimitPerMonth: Int<br/>profiles: Profile[]"]
    
    F --> F1["SubscribersOnAuthors:<br/>subscriber: User<br/>subscriberId: String<br/>author: User<br/>authorId: String<br/>@@id([subscriberId, authorId])"]
    
    G --> G1["User GraphQL:<br/>+ profile resolver<br/>+ posts resolver<br/>+ userSubscribedTo resolver<br/>+ subscribedToUser resolver"]
    G --> G2["Profile GraphQL:<br/>+ memberType resolver"]
    
    style A fill:#e3f2fd
    style G fill:#c8e6c9
    style B1 fill:#fff3e0
    style F1 fill:#ffebee
```

## Szczegółowy opis modeli:

### 1. User model
- **Pola podstawowe**: id (UUID), name, balance
- **Relacje**: profile (1:1), posts (1:N), subscriptions (N:N)
- **GraphQL impact**: Wymaga 4 resolverów dla relacji

### 2. Post model  
- **Pola podstawowe**: id (UUID), title, content
- **Relacje**: author (N:1 z User)
- **GraphQL impact**: Prosty typ bez dodatkowych resolverów

### 3. Profile model
- **Pola podstawowe**: id (UUID), isMale, yearOfBirth
- **Relacje**: user (1:1), memberType (N:1)
- **GraphQL impact**: Wymaga resolver dla memberType

### 4. MemberType model
- **Pola podstawowe**: id (String), discount, postsLimitPerMonth
- **Relacje**: profiles (1:N)
- **GraphQL impact**: Prosty typ bez dodatkowych resolverów

### 5. SubscribersOnAuthors (junction table)
- **Pola**: subscriberId, authorId (composite key)
- **Relacje**: subscriber (User), author (User)
- **GraphQL impact**: Ukryte - używane w User resolverach

**Cel**: Zrozumienie struktury danych i wymaganych resolverów