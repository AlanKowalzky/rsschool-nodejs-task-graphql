# Etap 5.1: GraphQL Resolve Info Parsing

```mermaid
flowchart TD
    A[GraphQL Resolve Info Parsing] --> B[Import graphql-parse-resolve-info]
    B --> C[Parse GraphQLResolveInfo]
    C --> D[Analyze requested fields]
    D --> E[Detect subscription fields]
    E --> F[Conditional logic]
    
    B --> B1["import { parseResolveInfo } from 'graphql-parse-resolve-info'<br/>Package już zainstalowany"]
    
    C --> C1["const parsedInfo = parseResolveInfo(info) as ResolveTree<br/>Parse AST do structured format<br/>Access to fieldsByTypeName"]
    
    D --> D1["parsedInfo.fieldsByTypeName.User<br/>Dostęp do requested fields<br/>userSubscribedTo, subscribedToUser"]
    
    E --> E1["shouldIncludeSubscriptions(info): boolean<br/>Check if userSubscribedTo OR subscribedToUser<br/>Return true if subscription fields requested"]
    
    F --> F1["if (shouldIncludeSubscriptions(info)) {<br/>  includeOptions.userSubscribedTo = { include: { author: true } }<br/>  includeOptions.subscribedToUser = { include: { subscriber: true } }<br/>}"]
    
    style A fill:#e3f2fd
    style F fill:#c8e6c9
    style C1 fill:#fff3e0
    style E1 fill:#f3e5f5
```

## Szczegółowa implementacja resolve info parsing:

### 1. GraphQL Resolve Info Structure
```typescript
interface GraphQLResolveInfo {
  fieldName: string;
  fieldNodes: FieldNode[];
  returnType: GraphQLOutputType;
  parentType: GraphQLObjectType;
  path: Path;
  schema: GraphQLSchema;
  fragments: FragmentMap;
  rootValue: any;
  operation: OperationDefinitionNode;
  variableValues: { [key: string]: any };
}
```

### 2. Parse Resolve Info Usage
```typescript
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';

const shouldIncludeSubscriptions = (info: GraphQLResolveInfo): boolean => {
  const parsedInfo = parseResolveInfo(info) as ResolveTree;
  
  if (!parsedInfo || !parsedInfo.fieldsByTypeName) {
    return false;
  }

  const userFields = parsedInfo.fieldsByTypeName.User;
  if (!userFields) {
    return false;
  }

  return !!(userFields.userSubscribedTo || userFields.subscribedToUser);
};
```

### 3. Query Analysis Examples

**Query WITH subscriptions:**
```graphql
{
  users {
    id
    name
    userSubscribedTo {  # ← Detected
      name
    }
  }
}
```
**Result**: `shouldIncludeSubscriptions() = true`

**Query WITHOUT subscriptions:**
```graphql
{
  users {
    id
    name
    profile {
      memberType {
        discount
      }
    }
  }
}
```
**Result**: `shouldIncludeSubscriptions() = false`

### 4. Conditional Include Logic
```typescript
const includeOptions: any = {
  profile: {
    include: {
      memberType: true,
    },
  },
  posts: true,
};

if (shouldIncludeSubscriptions(info)) {
  includeOptions.userSubscribedTo = {
    include: { author: true },
  };
  includeOptions.subscribedToUser = {
    include: { subscriber: true },
  };
}
```

### 5. Performance Benefits
- **Smart loading**: Subscriptions tylko gdy requested
- **Reduced joins**: Unikanie niepotrzebnych includes
- **Faster queries**: Mniejsze result sets gdy subscriptions nie są potrzebne
- **Conditional optimization**: Query tailored to actual needs

### 6. ResolveTree Structure
```typescript
interface ResolveTree {
  name: string;
  alias: string;
  args: { [key: string]: any };
  fieldsByTypeName: {
    [typeName: string]: {
      [fieldName: string]: ResolveTree;
    };
  };
}
```

**Cel**: Intelligent field detection dla conditional loading