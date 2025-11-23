# Etap 2.3: Implementacja Change i Delete Mutations

```mermaid
flowchart TD
    A[Change & Delete Mutations] --> B[Change Mutations]
    B --> C[Delete Mutations]
    
    B --> B1["changeUser: {<br/>  type: NonNull User,<br/>  args: {<br/>    id: { type: NonNull UUIDType },<br/>    dto: { type: NonNull ChangeUserInput }<br/>  },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.user.update({<br/>      where: { id: args.id },<br/>      data: args.dto<br/>    })<br/>  }<br/>}"]
    
    B --> B2["changeProfile: {<br/>  type: NonNull Profile,<br/>  args: { id: NonNull UUID, dto: NonNull ChangeProfileInput },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.profile.update({<br/>      where: { id: args.id },<br/>      data: args.dto<br/>    })<br/>  }<br/>}"]
    
    B --> B3["changePost: {<br/>  type: NonNull Post,<br/>  args: { id: NonNull UUID, dto: NonNull ChangePostInput },<br/>  resolve: async (parent, args, context) => {<br/>    return context.prisma.post.update({<br/>      where: { id: args.id },<br/>      data: args.dto<br/>    })<br/>  }<br/>}"]
    
    C --> C1["deleteUser: {<br/>  type: NonNull String,<br/>  args: { id: { type: NonNull UUIDType } },<br/>  resolve: async (parent, args, context) => {<br/>    await context.prisma.user.delete({<br/>      where: { id: args.id }<br/>    })<br/>    return 'User deleted successfully'<br/>  }<br/>}"]
    
    C --> C2["deleteProfile: {<br/>  type: NonNull String,<br/>  args: { id: NonNull UUID },<br/>  resolve: async (parent, args, context) => {<br/>    await context.prisma.profile.delete({<br/>      where: { id: args.id }<br/>    })<br/>    return 'Profile deleted successfully'<br/>  }<br/>}"]
    
    C --> C3["deletePost: {<br/>  type: NonNull String,<br/>  args: { id: NonNull UUID },<br/>  resolve: async (parent, args, context) => {<br/>    await context.prisma.post.delete({<br/>      where: { id: args.id }<br/>    })<br/>    return 'Post deleted successfully'<br/>  }<br/>}"]
    
    style A fill:#e3f2fd
    style C3 fill:#c8e6c9
    style B1 fill:#fff3e0
    style C1 fill:#ffebee
```

## Szczegółowy opis Change & Delete Mutations:

### 1. Change Mutations (3)
- **changeUser**: Aktualizuje name i/lub balance
- **changeProfile**: Aktualizuje isMale, yearOfBirth i/lub memberTypeId
- **changePost**: Aktualizuje title i/lub content

#### Wzorzec Change:
- **Args**: `{ id: NonNull UUID, dto: NonNull ChangeInput }`
- **Prisma**: `prisma.model.update({ where: { id }, data: dto })`
- **Return**: NonNull ModelType (zaktualizowany obiekt)
- **Input fields**: Wszystkie opcjonalne (partial update)

### 2. Delete Mutations (3)
- **deleteUser**: Usuwa użytkownika po ID
- **deleteProfile**: Usuwa profil po ID  
- **deletePost**: Usuwa post po ID

#### Wzorzec Delete:
- **Args**: `{ id: NonNull UUID }`
- **Prisma**: `prisma.model.delete({ where: { id } })`
- **Return**: NonNull String (success message)
- **Cascade**: Prisma schema definiuje cascade behavior

### 3. Input Types dla Change
- **ChangeUserInput**: `{ name?: String, balance?: Float }`
- **ChangeProfileInput**: `{ isMale?: Boolean, yearOfBirth?: Int, memberTypeId?: MemberTypeId }`
- **ChangePostInput**: `{ title?: String, content?: String }`

### 4. Error Handling
- **Not found**: Prisma rzuca błąd jeśli ID nie istnieje
- **Constraint violations**: Foreign key, unique constraints
- **Cascade deletes**: User deletion → Profile/Posts deletion (jeśli skonfigurowane)

### 5. Return Values
- **Change mutations**: Zwracają zaktualizowany obiekt
- **Delete mutations**: Zwracają success message string
- **Consistency**: Zgodne z wymaganiami schema.graphql

**Cel**: Kompletne CRUD operations (Update, Delete) z proper error handling