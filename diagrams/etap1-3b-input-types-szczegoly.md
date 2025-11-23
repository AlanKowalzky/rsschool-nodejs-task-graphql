# Etap 1.3b: Szczegółowe Input Types

```mermaid
flowchart TD
    A[Input Types Implementation] --> B[User Inputs]
    B --> C[Post Inputs]
    C --> D[Profile Inputs]
    
    B --> B1["CreateUserInput:<br/>new GraphQLInputObjectType({<br/>  name: 'CreateUserInput',<br/>  fields: {<br/>    name: { type: new GraphQLNonNull(GraphQLString) },<br/>    balance: { type: new GraphQLNonNull(GraphQLFloat) }<br/>  }<br/>})"]
    
    B --> B2["ChangeUserInput:<br/>new GraphQLInputObjectType({<br/>  name: 'ChangeUserInput',<br/>  fields: {<br/>    name: { type: GraphQLString },<br/>    balance: { type: GraphQLFloat }<br/>  }<br/>})"]
    
    C --> C1["CreatePostInput:<br/>new GraphQLInputObjectType({<br/>  name: 'CreatePostInput',<br/>  fields: {<br/>    title: { type: new GraphQLNonNull(GraphQLString) },<br/>    content: { type: new GraphQLNonNull(GraphQLString) },<br/>    authorId: { type: new GraphQLNonNull(UUIDType) }<br/>  }<br/>})"]
    
    C --> C2["ChangePostInput:<br/>new GraphQLInputObjectType({<br/>  name: 'ChangePostInput',<br/>  fields: {<br/>    title: { type: GraphQLString },<br/>    content: { type: GraphQLString }<br/>  }<br/>})"]
    
    D --> D1["CreateProfileInput:<br/>new GraphQLInputObjectType({<br/>  name: 'CreateProfileInput',<br/>  fields: {<br/>    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },<br/>    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },<br/>    userId: { type: new GraphQLNonNull(UUIDType) },<br/>    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) }<br/>  }<br/>})"]
    
    D --> D2["ChangeProfileInput:<br/>new GraphQLInputObjectType({<br/>  name: 'ChangeProfileInput',<br/>  fields: {<br/>    isMale: { type: GraphQLBoolean },<br/>    yearOfBirth: { type: GraphQLInt },<br/>    memberTypeId: { type: MemberTypeIdEnum }<br/>  }<br/>})"]
    
    style A fill:#e3f2fd
    style D2 fill:#c8e6c9
    style B1 fill:#fff3e0
    style C1 fill:#f3e5f5
    style D1 fill:#e8f5e8
```

## Szczegółowy opis Input Types:

### 1. User Input Types
- **CreateUserInput**: name (required), balance (required)
- **ChangeUserInput**: name (optional), balance (optional)
- **Logika**: Create wymaga wszystkich pól, Change - opcjonalne

### 2. Post Input Types  
- **CreatePostInput**: title (required), content (required), authorId (required)
- **ChangePostInput**: title (optional), content (optional)
- **Logika**: authorId tylko przy tworzeniu, nie można zmieniać

### 3. Profile Input Types
- **CreateProfileInput**: wszystkie pola wymagane (isMale, yearOfBirth, userId, memberTypeId)
- **ChangeProfileInput**: wszystkie pola opcjonalne oprócz userId (nie można zmieniać)
- **Logika**: userId tylko przy tworzeniu, reszta można zmieniać

### 4. Kluczowe wzorce
- **Create inputs**: Wszystkie pola NonNull
- **Change inputs**: Pola opcjonalne (bez NonNull)
- **ID fields**: Tylko w Create, nie w Change
- **Type consistency**: Zgodność z Object Types

**Cel**: Precyzyjne input types dla wszystkich mutations