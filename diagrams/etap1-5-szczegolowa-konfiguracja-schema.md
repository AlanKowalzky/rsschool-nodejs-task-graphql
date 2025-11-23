# Etap 1.5: Szczegółowa konfiguracja GraphQL Schema

```mermaid
flowchart TD
    A[Modyfikacja index.ts] --> B[Imports update]
    B --> C[Schema creation]
    C --> D[Route configuration]
    D --> E[Handler implementation]
    E --> F[GraphQL execution]
    
    B --> B1["import { graphql, GraphQLSchema } from 'graphql'<br/>import { RootQueryType, Mutations } from './resolvers.js'<br/>import { UUIDType } from './types/uuid.js'"]
    
    C --> C1["const schema = new GraphQLSchema({<br/>  query: RootQueryType,<br/>  mutation: Mutations,<br/>  types: [UUIDType]<br/>})"]
    
    D --> D1["fastify.route({<br/>  url: '/',<br/>  method: 'POST',<br/>  schema: {<br/>    ...createGqlResponseSchema,<br/>    response: { 200: gqlResponseSchema }<br/>  },<br/>  async handler(req) { ... }<br/>})"]
    
    E --> E1["async handler(req) {<br/>  const { query, variables } = req.body<br/>  const context = { prisma }<br/>  return graphql({ ... })<br/>}"]
    
    F --> F1["return graphql({<br/>  schema,<br/>  source: query,<br/>  variableValues: variables,<br/>  contextValue: context<br/>})"]
    
    style A fill:#e3f2fd
    style F fill:#c8e6c9
    style C1 fill:#fff3e0
    style E1 fill:#f3e5f5
    style F1 fill:#e8f5e8
```

## Szczegółowy opis konfiguracji:

### 1. Imports update
- **GraphQLSchema**: Do utworzenia schema
- **RootQueryType, Mutations**: Z ./resolvers.js
- **UUIDType**: Custom scalar type
- **graphql**: Execution function

### 2. Schema creation
- **query**: RootQueryType (8 queries)
- **mutation**: Mutations (11 mutations)  
- **types**: [UUIDType] - custom scalars
- **Brak subscription**: Nie wymagane w zadaniu

### 3. Route configuration
- **URL**: '/' (POST /graphql)
- **Method**: POST
- **Schema**: Fastify validation schemas
- **Handler**: Async function

### 4. Handler implementation
- **Input**: Destructure query, variables z req.body
- **Context**: { prisma } - dostęp do bazy danych
- **Output**: Wynik graphql() execution

### 5. GraphQL execution
- **schema**: Utworzona GraphQL schema
- **source**: Query string z request
- **variableValues**: Variables z request
- **contextValue**: Context z prisma
- **Brak validationRules**: Dodane w etapie 3

### 6. Stan po etapie 1
- **Schema**: Kompletna struktura
- **Resolvers**: Zdefiniowane ale nie zaimplementowane
- **Endpoint**: Gotowy do obsługi requests
- **Context**: Prisma dostępna w resolvers

**Cel**: Działający GraphQL endpoint z kompletną strukturą