# Etap 2.2: Implementacja Create Mutations

```mermaid
flowchart TD
    A[Create Mutations Implementation] --> B[createUser]
    B --> C[createProfile]
    C --> D[createPost]
    
    B --> B1["createUser: {<br/>  type: NonNull User,<br/>  args: { dto: { type: NonNull CreateUserInput } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.user.create({<br/>      data: args.dto<br/>    })<br/>  }<br/>}"]
    
    C --> C1["createProfile: {<br/>  type: NonNull Profile,<br/>  args: { dto: { type: NonNull CreateProfileInput } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.profile.create({<br/>      data: args.dto<br/>    })<br/>  }<br/>}"]
    
    D --> D1["createPost: {<br/>  type: NonNull Post,<br/>  args: { dto: { type: NonNull CreatePostInput } },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.post.create({<br/>      data: args.dto<br/>    })<br/>  }<br/>}"]
    
    B1 --> B2["Input: CreateUserInput<br/>{<br/>  name: String! (required)<br/>  balance: Float! (required)<br/>}<br/>Output: User object"]
    
    C1 --> C2["Input: CreateProfileInput<br/>{<br/>  isMale: Boolean! (required)<br/>  yearOfBirth: Int! (required)<br/>  userId: UUID! (required)<br/>  memberTypeId: MemberTypeId! (required)<br/>}<br/>Output: Profile object"]
    
    D1 --> D2["Input: CreatePostInput<br/>{<br/>  title: String! (required)<br/>  content: String! (required)<br/>  authorId: UUID! (required)<br/>}<br/>Output: Post object"]
    
    style A fill:#e3f2fd
    style D fill:#c8e6c9
    style B1 fill:#fff3e0
    style C1 fill:#f3e5f5
    style D1 fill:#e8f5e8
```

## Szczegółowy opis Create Mutations:

### 1. createUser
- **Input**: `CreateUserInput` (name, balance - oba wymagane)
- **Prisma call**: `prisma.user.create({ data: args.dto })`
- **Output**: Nowo utworzony User object
- **Walidacja**: Prisma schema validation

### 2. createProfile
- **Input**: `CreateProfileInput` (isMale, yearOfBirth, userId, memberTypeId - wszystkie wymagane)
- **Prisma call**: `prisma.profile.create({ data: args.dto })`
- **Output**: Nowo utworzony Profile object
- **Constraints**: userId musi być unique, memberTypeId musi istnieć

### 3. createPost
- **Input**: `CreatePostInput` (title, content, authorId - wszystkie wymagane)
- **Prisma call**: `prisma.post.create({ data: args.dto })`
- **Output**: Nowo utworzony Post object
- **Constraints**: authorId musi istnieć (foreign key)

### 4. Wzorce implementacji
- **Argument pattern**: `{ dto: { type: NonNull CreateInput } }`
- **Prisma pattern**: `prisma.model.create({ data: args.dto })`
- **Return type**: `NonNull ModelType`
- **Error handling**: Prisma automatycznie rzuca błędy dla constraint violations

### 5. Potencjalne błędy
- **Unique constraint**: userId w Profile
- **Foreign key**: authorId w Post, memberTypeId w Profile
- **Required fields**: Wszystkie pola w CreateInput są wymagane

**Cel**: Implementacja tworzenia nowych rekordów z proper validation