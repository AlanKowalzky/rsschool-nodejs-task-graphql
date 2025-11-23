# Etap 4: Implementacja DataLoader dla rozwiązania problemu N+1

```mermaid
flowchart TD
    A[Start Etapu 4] --> B[Analiza problemu N+1]
    B --> C[Implementacja DataLoaders]
    C --> D[Refaktoryzacja resolvers]
    D --> E[Optymalizacja zapytań]
    E --> F[Testowanie DataLoader]
    F --> G[Commit Etapu 4]
    
    B --> B1[Problem: N queries dla N users]
    B --> B2[Rozwiązanie: 1 query dla wszystkich]
    B --> B3[Batch loading strategy]
    
    C --> C1[UserLoader]
    C --> C2[PostLoader]
    C --> C3[ProfileLoader]
    C --> C4[MemberTypeLoader]
    C --> C5[SubscriptionLoaders]
    
    D --> D1[User.profile → profileByUserIdLoader]
    D --> D2[User.posts → postsByAuthorLoader]
    D --> D3[User.subscriptions → subscriptionLoaders]
    D --> D4[Profile.memberType → memberTypeLoader]
    
    E --> E1[Jeden findMany per loader]
    E --> E2[Batch loading w grupach]
    E --> E3[Cache management]
    
    F --> F1[npm run test-loader]
    F --> F2[Weryfikacja wydajności]
    F --> F3[Funkcjonalność bez zmian]
    
    style A fill:#e3f2fd
    style G fill:#c8e6c9
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style E fill:#e8f5e8
```

## Kluczowe komponenty Etapu 4:

### 1. Problem N+1
- **Obecny stan**: Każdy User w liście triggeruje osobne queries dla profile/posts
- **Przykład**: 10 users → 1 query users + 10 queries profiles + 10 queries posts = 21 queries
- **Cel**: 10 users → 1 query users + 1 query profiles + 1 query posts = 3 queries

### 2. DataLoader Implementation
- **UserLoader**: Batch loading użytkowników po ID
- **ProfileLoader**: Batch loading profili po ID i userId
- **PostLoader**: Batch loading postów po ID i authorId
- **MemberTypeLoader**: Batch loading typów członkostwa
- **SubscriptionLoaders**: Batch loading subscriptions

### 3. Batch Loading Strategy
- **Collect**: Zbieranie wszystkich requested IDs
- **Batch**: Jeden findMany call z wszystkimi IDs
- **Distribute**: Mapowanie wyników do original requests
- **Cache**: Automatyczne cache dla duplicate requests

### 4. Wymagania
- Jeden findMany call per loader
- Zachowanie funkcjonalności
- Poprawa wydajności
- DataLoader package (już zainstalowany)