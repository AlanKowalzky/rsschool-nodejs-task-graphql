# Etap 3: Implementacja ograniczenia głębokości zapytań (Depth Limit)

```mermaid
flowchart TD
    A[Start Etapu 3] --> B[Analiza wymagań depth limit]
    B --> C[Import graphql-depth-limit]
    C --> D[Konfiguracja depth limit = 5]
    D --> E[Dodanie validation rules]
    E --> F[Modyfikacja graphql() call]
    F --> G[Testowanie depth limit]
    G --> H[Dokumentacja przykładów]
    H --> I[Commit Etapu 3]
    
    B --> B1[Maksymalna głębokość: 5]
    B --> B2[Zapytania > 5 poziomów: REJECTED]
    B --> B3[Zapytania ≤ 5 poziomów: ACCEPTED]
    
    C --> C1[import depthLimit from 'graphql-depth-limit']
    
    D --> D1[depthLimit(5)]
    D --> D2[Konfiguracja w validationRules]
    
    E --> E1[validationRules: [depthLimit(5)]]
    E --> E2[Integracja z graphql() execution]
    
    G --> G1[Test: query depth 1-5 ✓]
    G --> G2[Test: query depth 6+ ✗]
    G --> G3[Error message validation]
    
    style A fill:#e3f2fd
    style I fill:#c8e6c9
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#e8f5e8
```

## Kluczowe komponenty Etapu 3:

### 1. Depth Limit Configuration
- **Package**: graphql-depth-limit (już zainstalowany)
- **Maksymalna głębokość**: 5 poziomów
- **Validation**: Przed execution GraphQL query

### 2. Przykłady zapytań:
- **Poziom 1**: `{ users { id } }` ✓
- **Poziom 3**: `{ users { profile { memberType { id } } } }` ✓
- **Poziom 5**: `{ users { profile { memberType { profiles { user { id } } } } } }` ✓
- **Poziom 6**: `{ users { profile { memberType { profiles { user { posts { id } } } } } } }` ✗

### 3. Implementation Steps:
1. Import depthLimit z graphql-depth-limit
2. Dodanie do validationRules w graphql()
3. Konfiguracja maksymalnej głębokości na 5
4. Test functionality

### 4. Error Handling:
- Zapytania przekraczające limit zwracają validation error
- Error message wskazuje przekroczenie depth limit
- Query nie jest wykonywane jeśli przekracza limit