# Etap 1.3: Szczegółowe utworzenie types.ts

```mermaid
flowchart TD
    A[Rozpoczęcie types.ts] --> B[Import GraphQL types]
    B --> C[Import UUIDType]
    C --> D[MemberTypeIdEnum]
    D --> E[MemberType ObjectType]
    E --> F[Post ObjectType]
    F --> G[Profile ObjectType]
    G --> H[User ObjectType]
    H --> I[Input Types]
    
    B --> B1["GraphQLObjectType, GraphQLString<br/>GraphQLFloat, GraphQLInt, GraphQLBoolean<br/>GraphQLList, GraphQLNonNull<br/>GraphQLEnumType, GraphQLInputObjectType"]
    
    D --> D1["new GraphQLEnumType({<br/>  name: 'MemberTypeId',<br/>  values: {<br/>    BASIC: { value: 'BASIC' },<br/>    BUSINESS: { value: 'BUSINESS' }<br/>  }<br/>})"]
    
    E --> E1["new GraphQLObjectType({<br/>  name: 'MemberType',<br/>  fields: () => ({<br/>    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },<br/>    discount: { type: new GraphQLNonNull(GraphQLFloat) },<br/>    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) }<br/>  })<br/>})"]
    
    F --> F1["new GraphQLObjectType({<br/>  name: 'Post',<br/>  fields: () => ({<br/>    id: { type: new GraphQLNonNull(UUIDType) },<br/>    title: { type: new GraphQLNonNull(GraphQLString) },<br/>    content: { type: new GraphQLNonNull(GraphQLString) }<br/>  })<br/>})"]
    
    style A fill:#e3f2fd
    style I fill:#c8e6c9
    style D1 fill:#fff3e0
    style E1 fill:#f3e5f5
```

## Szczegółowy opis implementacji:

### 1. Imports
- **GraphQL core types**: ObjectType, String, Float, Int, Boolean
- **GraphQL modifiers**: List, NonNull  
- **GraphQL special**: EnumType, InputObjectType
- **Custom types**: UUIDType z ./types/uuid.js

### 2. MemberTypeIdEnum
- **Typ**: GraphQLEnumType
- **Wartości**: BASIC: 'BASIC', BUSINESS: 'BUSINESS'
- **Użycie**: W Profile.memberTypeId i queries

### 3. Object Types
- **MemberType**: 3 pola (id, discount, postsLimitPerMonth)
- **Post**: 3 pola (id, title, content)  
- **Profile**: 4 pola (id, isMale, yearOfBirth, memberType)
- **User**: 6 pól (id, name, balance, profile, posts, subscriptions)

### 4. Kluczowe cechy
- **NonNull wrapping**: Wszystkie wymagane pola
- **List wrapping**: Arrays dla posts i subscriptions
- **Lazy fields**: () => ({}) dla circular references
- **No resolvers**: Tylko struktura typów

**Cel**: Kompletna definicja typów GraphQL zgodna ze schematem