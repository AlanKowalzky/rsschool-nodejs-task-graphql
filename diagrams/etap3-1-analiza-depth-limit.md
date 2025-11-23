# Etap 3.1: Analiza wymagań Depth Limit

```mermaid
flowchart TD
    A[Analiza Depth Limit] --> B[Wymagania zadania]
    B --> C[Analiza możliwych zapytań]
    C --> D[Identyfikacja poziomów głębokości]
    D --> E[Przykłady zapytań]
    
    B --> B1["Wymaganie: Limit głębokości = 5<br/>Package: graphql-depth-limit<br/>Test: npm run test-rule"]
    
    C --> C1["Możliwe ścieżki w schema:<br/>User → Profile → MemberType (3 poziomy)<br/>User → Posts (2 poziomy)<br/>User → Subscriptions → Profile → MemberType (4 poziomy)"]
    
    D --> D1["Poziom 1: { users }<br/>Poziom 2: { users { profile } }<br/>Poziom 3: { users { profile { memberType } } }<br/>Poziom 4: { users { userSubscribedTo { profile } } }<br/>Poziom 5: { users { userSubscribedTo { profile { memberType } } } }"]
    
    E --> E1["DOZWOLONE (≤5):<br/>{ users { id, name, balance } }<br/>{ users { profile { isMale, yearOfBirth } } }<br/>{ users { posts { title, content } } }<br/>{ users { userSubscribedTo { name } } }<br/>{ users { profile { memberType { discount } } } }"]
    
    E --> E2["ZABRONIONE (>5):<br/>{ users { userSubscribedTo { profile { memberType { profiles { user { name } } } } } } }<br/>{ users { subscribedToUser { userSubscribedTo { profile { memberType { id } } } } } }"]
    
    style A fill:#e3f2fd
    style E2 fill:#ffebee
    style E1 fill:#e8f5e8
    style B1 fill:#fff3e0
```

## Szczegółowa analiza poziomów głębokości:

### 1. Struktura relacji GraphQL
```
User (1)
├── profile (2)
│   └── memberType (3)
│       └── profiles (4)
│           └── user (5)
│               ├── posts (6) ❌
│               └── profile (6) ❌
├── posts (2)
├── userSubscribedTo (2)
│   ├── profile (3)
│   │   └── memberType (4)
│   │       └── profiles (5)
│   │           └── user (6) ❌
│   └── posts (3)
└── subscribedToUser (2)
    └── [same as userSubscribedTo]
```

### 2. Przykłady zapytań według poziomów:

**Poziom 1:**
```graphql
{ users { id } }
{ posts { title } }
```

**Poziom 2:**
```graphql
{ users { profile { id } } }
{ users { posts { title } } }
```

**Poziom 3:**
```graphql
{ users { profile { memberType { id } } } }
{ users { userSubscribedTo { name } } }
```

**Poziom 4:**
```graphql
{ users { userSubscribedTo { profile { isMale } } } }
```

**Poziom 5 (maksymalny dozwolony):**
```graphql
{ users { userSubscribedTo { profile { memberType { discount } } } } }
```

**Poziom 6+ (zabronione):**
```graphql
{ users { userSubscribedTo { profile { memberType { profiles { id } } } } } }
```

### 3. Kluczowe obserwacje:
- **Najgłębsza ścieżka**: User → userSubscribedTo → profile → memberType → profiles (5 poziomów)
- **Cykliczne relacje**: User ↔ User przez subscriptions
- **Potencjał przekroczenia**: Łatwo przekroczyć limit przez cykliczne relacje

**Cel**: Zrozumienie struktury zapytań i identyfikacja przypadków testowych