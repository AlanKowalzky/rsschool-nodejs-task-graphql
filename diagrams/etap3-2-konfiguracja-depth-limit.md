# Etap 3.2: Konfiguracja graphql-depth-limit

```mermaid
flowchart TD
    A[Konfiguracja Depth Limit] --> B[Import package]
    B --> C[Dodanie do validation rules]
    C --> D[Modyfikacja graphql call]
    D --> E[Testowanie konfiguracji]
    
    B --> B1["import depthLimit from graphql-depth-limit<br/>Package już zainstalowany w node_modules"]
    
    C --> C1["validationRules: depthLimit 5<br/>Maksymalna głębokość = 5<br/>Zgodnie z wymaganiami zadania"]
    
    D --> D1["return graphql schema source query<br/>variableValues variables<br/>contextValue context<br/>validationRules depthLimit 5"]
    
    E --> E1["Test 1: Zapytanie głębokość 3 SUCCESS<br/>Test 2: Zapytanie głębokość 6 ERROR<br/>Test 3: Validation error message"]
    
    style A fill:#e3f2fd
    style E fill:#c8e6c9
    style B1 fill:#fff3e0
    style D1 fill:#f3e5f5
```

## Szczegółowa implementacja:

### 1. Import Statement
```typescript
import depthLimit from 'graphql-depth-limit';
```
- **Package**: graphql-depth-limit (już w dependencies)
- **Type**: Default import
- **Function**: depthLimit(maxDepth: number)

### 2. Validation Rules Configuration
```typescript
validationRules: [depthLimit(5)]
```
- **Array**: validationRules przyjmuje array of validation functions
- **Depth**: 5 (zgodnie z wymaganiami)
- **Execution**: Validation przed query execution

### 3. GraphQL Execution Update
**Przed:**
```typescript
return graphql({
  schema,
  source: query,
  variableValues: variables,
  contextValue: context,
});
```

**Po:**
```typescript
return graphql({
  schema,
  source: query,
  variableValues: variables,
  contextValue: context,
  validationRules: [depthLimit(5)],
});
```

### 4. Jak działa depth limit:
1. **Parse**: GraphQL parsuje query do AST
2. **Validate**: depthLimit analizuje AST i liczy głębokość
3. **Check**: Jeśli głębokość > 5, zwraca validation error
4. **Execute**: Tylko jeśli validation passes

### 5. Error Response Format:
```json
{
  "errors": [
    {
      "message": "Query exceeded maximum depth of 5",
      "locations": [...],
      "path": [...]
    }
  ]
}
```

### 6. Performance Benefits:
- **Early rejection**: Zapytania są odrzucane przed execution
- **DoS protection**: Zapobiega bardzo głębokim zapytaniom
- **Resource saving**: Nie wykonuje kosztownych operacji DB

**Cel**: Minimalna konfiguracja depth limit zgodna z wymaganiami