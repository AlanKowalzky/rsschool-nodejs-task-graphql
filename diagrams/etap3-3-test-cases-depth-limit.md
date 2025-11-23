# Etap 3.3: Test Cases dla Depth Limit

```mermaid
flowchart TD
    A[Test Cases Depth Limit] --> B[Valid Queries ≤5]
    B --> C[Invalid Queries >5]
    C --> D[Edge Cases]
    D --> E[Error Validation]
    
    B --> B1["Depth 1: { users { id } } ✓<br/>Depth 2: { users { profile { id } } } ✓<br/>Depth 3: { users { profile { memberType { id } } } } ✓<br/>Depth 4: { users { userSubscribedTo { profile { isMale } } } } ✓<br/>Depth 5: { users { userSubscribedTo { profile { memberType { discount } } } } } ✓"]
    
    C --> C1["Depth 6: { users { userSubscribedTo { profile { memberType { profiles { id } } } } } } ❌<br/>Depth 7: { users { subscribedToUser { userSubscribedTo { profile { memberType { discount } } } } } } ❌<br/>Depth 8: Complex nested subscriptions ❌"]
    
    D --> D1["Exactly depth 5: Boundary test<br/>Multiple fields same depth: { users { profile { memberType { id } }, posts { title } } }<br/>Different branches: Some ≤5, some >5<br/>Fragment usage: With fragments"]
    
    E --> E1["Error message contains 'depth'<br/>Error type: ValidationError<br/>HTTP status: 400 Bad Request<br/>No data field in response<br/>Proper error location info"]
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style B1 fill:#e8f5e8
    style C1 fill:#ffebee
    style D1 fill:#fff3e0
```

## Szczegółowe test cases:

### 1. Valid Queries (Depth ≤ 5)

**Depth 1:**
```graphql
query {
  users { id name balance }
  posts { id title }
  memberTypes { id }
}
```

**Depth 2:**
```graphql
query {
  users {
    profile { id }
    posts { title }
  }
}
```

**Depth 3:**
```graphql
query {
  users {
    profile {
      memberType { id discount }
    }
    userSubscribedTo { name }
  }
}
```

**Depth 4:**
```graphql
query {
  users {
    userSubscribedTo {
      profile { isMale yearOfBirth }
    }
  }
}
```

**Depth 5 (maksymalny):**
```graphql
query {
  users {
    userSubscribedTo {
      profile {
        memberType { discount postsLimitPerMonth }
      }
    }
  }
}
```

### 2. Invalid Queries (Depth > 5)

**Depth 6:**
```graphql
query {
  users {
    userSubscribedTo {
      profile {
        memberType {
          profiles { id }  # 6th level
        }
      }
    }
  }
}
```

**Depth 7:**
```graphql
query {
  users {
    subscribedToUser {
      userSubscribedTo {
        profile {
          memberType {
            profiles { user { id } }  # 7th level
          }
        }
      }
    }
  }
}
```

### 3. Edge Cases

**Multiple branches (mixed depths):**
```graphql
query {
  users {
    profile { memberType { id } }  # Depth 3 ✓
    userSubscribedTo {
      profile {
        memberType {
          profiles { id }  # Depth 6 ❌
        }
      }
    }
  }
}
# Result: ERROR (najgłębsza ścieżka > 5)
```

**Exactly depth 5:**
```graphql
query {
  users {
    profile {
      memberType {
        profiles {
          isMale  # Exactly depth 5 ✓
        }
      }
    }
  }
}
```

### 4. Expected Error Response

```json
{
  "errors": [
    {
      "message": "Query exceeded maximum depth of 5",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ]
    }
  ]
}
```

### 5. Test Command
```bash
npm run test-rule
```
- **Test file**: `test/routes/gql-rule.test.js`
- **Validates**: Depth limit functionality
- **Checks**: Both valid and invalid queries

**Cel**: Komprehensywne testowanie depth limit functionality