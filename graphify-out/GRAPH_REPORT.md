# Graph Report - rukn-al-assi-dashboard  (2026-07-31)

## Corpus Check
- 519 files · ~114,088 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 237 nodes · 495 edges · 11 communities (8 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `29414643`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- contact-messages-table.tsx
- ContactMessageStatus
- supabase-contact-messages.repository.ts
- use-contact-messages-hooks.ts
- IContactMessagesRepository
- SupabaseContactMessagesRepository
- ContactMessageFilterParams
- page.tsx
- i-contact-messages.repository.ts
- admin-sidebar.tsx
- UserProfileEntity

## God Nodes (most connected - your core abstractions)
1. `IContactMessagesRepository` - 23 edges
2. `IAuthRepository` - 21 edges
3. `ContactMessageStatus` - 18 edges
4. `ContactMessageEntity` - 17 edges
5. `SupabaseContactMessagesRepository` - 12 edges
6. `SupabaseAuthRepository` - 11 edges
7. `UserProfileEntity` - 11 edges
8. `useAuthStore` - 10 edges
9. `ContactMessageFilterParams` - 7 edges
10. `ContactMessagesTable()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `ContactMessagesState` --references--> `ContactMessageStatus`  [EXTRACTED]
  src/features/contact-messages/presentation/stores/contact-messages.store.ts → src/features/contact-messages/domain/entities/contact-message.entity.ts
- `useCurrentUser()` --calls--> `useAuthStore`  [EXTRACTED]
  src/shared/hooks/auth/use-auth-hooks.ts → src/features/authentication/presentation/stores/auth.store.ts
- `SupabaseContactMessagesRepository` --implements--> `IContactMessagesRepository`  [EXTRACTED]
  src/features/contact-messages/data/repositories/supabase-contact-messages.repository.ts → src/features/contact-messages/domain/repositories/i-contact-messages.repository.ts
- `SupabaseAuthRepository` --implements--> `IAuthRepository`  [EXTRACTED]
  src/features/authentication/data/repositories/supabase-auth.repository.ts → src/features/authentication/domain/repositories/i-auth.repository.ts
- `ChangePasswordModal()` --calls--> `useAuthStore`  [EXTRACTED]
  src/features/authentication/presentation/components/change-password-modal.tsx → src/features/authentication/presentation/stores/auth.store.ts

## Import Cycles
- None detected.

## Communities (11 total, 3 thin omitted)

### Community 0 - "contact-messages-table.tsx"
Cohesion: 0.13
Nodes (25): CONTACT_MESSAGE_STATUS_LABELS, CONTACT_MESSAGE_STATUS_VARIANTS, ContactMessageStatusEnum, ContactMessagesTable(), MessageDetailsDrawer(), MessageEmailReplyModal(), MessageReplyFormValues, messageReplySchema (+17 more)

### Community 1 - "ContactMessageStatus"
Cohesion: 0.11
Nodes (14): metadata, metadata, metadata, ForgotPasswordForm(), ForgotPasswordFormValues, forgotPasswordSchema, ResetPasswordForm(), ResetPasswordFormValues (+6 more)

### Community 2 - "supabase-contact-messages.repository.ts"
Cohesion: 0.29
Nodes (6): Database, Enums, InsertTables, Json, Tables, UpdateTables

### Community 3 - "use-contact-messages-hooks.ts"
Cohesion: 0.12
Nodes (23): QueryKeys, ChangePasswordFormValues, ChangePasswordModal(), changePasswordSchema, LoginForm(), LoginFormValues, loginSchema, AuthState (+15 more)

### Community 4 - "IContactMessagesRepository"
Cohesion: 0.48
Nodes (6): config, intlMiddleware, isExcludedPath(), middleware(), PUBLIC_AUTH_ROUTES, PUBLIC_EXCLUDE_PATHS

### Community 8 - "i-contact-messages.repository.ts"
Cohesion: 0.09
Nodes (15): ContactMessageDTO, ContactMessageEntity, ContactMessageProps, ContactMessageStatus, ContactMessageFilterParams, IContactMessagesRepository, PaginatedContactMessages, SendMessageReplyInput (+7 more)

### Community 9 - "admin-sidebar.tsx"
Cohesion: 0.40
Nodes (3): AdminSidebarProps, NAV_ITEMS, NavItem

### Community 10 - "UserProfileEntity"
Cohesion: 0.07
Nodes (17): AdminProfileDTO, AuthUserDTO, toUserProfileEntity(), SupabaseAuthRepository, UserProfileEntity, UserProfileProps, ChangePasswordInput, IAuthRepository (+9 more)

## Knowledge Gaps
- **44 isolated node(s):** `metadata`, `metadata`, `metadata`, `changePasswordSchema`, `ChangePasswordFormValues` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `QueryKeys` connect `use-contact-messages-hooks.ts` to `contact-messages-table.tsx`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Why does `SupabaseAuthRepository` connect `UserProfileEntity` to `use-contact-messages-hooks.ts`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `SupabaseContactMessagesRepository` connect `SupabaseContactMessagesRepository` to `i-contact-messages.repository.ts`, `contact-messages-table.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `contact-messages-table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12878787878787878 - nodes in this community are weakly interconnected._
- **Should `ContactMessageStatus` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Should `use-contact-messages-hooks.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11724137931034483 - nodes in this community are weakly interconnected._