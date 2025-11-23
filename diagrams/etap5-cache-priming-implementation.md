# Etap 5: Cache Priming i finalne optymalizacje

```mermaid
flowchart TD
    A[Start Etapu 5] --> B[Analiza wymagań cache priming]
    B --> C[Implementacja resolve info parsing]
    C --> D[Conditional includes logic]
    D --> E[Cache priming implementation]
    E --> F[Users query optimization]
    F --> G[Testowanie cache priming]
    G --> H[Commit Etapu 5]
    
    B --> B1[Preload users do cache]
    B --> B2[Unikanie redundant DB calls]
    B --> B3[Smart subscription loading]
    
    C --> C1[graphql-parse-resolve-info]
    C --> C2[Analiza GraphQLResolveInfo]
    C --> C3[Detect subscription fields]
    
    D --> D1[Include subscriptions tylko gdy potrzebne]
    D --> D2[Conditional join logic]
    D --> D3[Performance optimization]
    
    E --> E1[Prime user cache]
    E --> E2[Prime profile cache]
    E --> E3[Prime posts cache]
    E --> E4[Prime subscription cache]
    
    F --> F1[Smart users query]
    F --> F2[Conditional includes]
    F --> F3[Cache population]
    
    G --> G1[npm run test-loader-prime]
    G --> G2[Weryfikacja cache behavior]
    G --> G3[Performance validation]
    
    style A fill:#e3f2fd
    style H fill:#c8e6c9
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#e8f5e8
```

## Kluczowe komponenty Etapu 5:

### 1. Cache Priming Strategy
- **Problem**: Users query triggeruje DataLoader calls dla subs
- **Rozwiązanie**: Preload wszystkich users do cache
- **Benefit**: Zero dodatkowych DB calls dla subscriptions

### 2. Conditional Includes
- **graphql-parse-resolve-info**: Analiza requested fields
- **Smart loading**: Include subscriptions tylko gdy requested
- **Performance**: Unikanie niepotrzebnych joins

### 3. Implementation Steps
1. Parse GraphQLResolveInfo w users query
2. Detect czy subscriptions są requested
3. Conditional include subscriptions w Prisma query
4. Prime cache z loaded data
5. DataLoaders używają cache zamiast DB

### 4. Expected Results
- **npm run test-loader-prime**: ✅ PASSED
- **Zero redundant queries**: Cache hits zamiast DB calls
- **Smart loading**: Subscriptions tylko gdy potrzebne
- **Performance**: Optimal query execution