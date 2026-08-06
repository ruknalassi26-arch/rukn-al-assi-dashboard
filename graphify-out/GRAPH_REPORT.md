# Graph Report - rukn-al-assi-dashboard  (2026-08-06)

## Corpus Check
- 634 files · ~141,262 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 393 nodes · 681 edges · 21 communities (9 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa403181`
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
- i-auth.repository.ts
- SupabaseAuthRepository
- SendPasswordResetInput
- sign-in.usecase.ts
- i18n.ts
- get-current-user.usecase.ts
- SupabaseSeoRepository
- SupabaseSettingsRepository
- SupabaseActivityLogRepository
- SupabaseGlobalSearchRepository

## God Nodes (most connected - your core abstractions)
1. `SupabaseHomepageRepository` - 42 edges
2. `SupabaseAboutRepository` - 37 edges
3. `IContactMessagesRepository` - 22 edges
4. `IAuthRepository` - 21 edges
5. `ContactMessageStatus` - 16 edges
6. `ContactMessageEntity` - 15 edges
7. `SupabaseContactRepository` - 13 edges
8. `SupabaseContactMessagesRepository` - 11 edges
9. `SupabaseAuthRepository` - 11 edges
10. `UserProfileEntity` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ContactMessagesState` --references--> `ContactMessageStatus`  [EXTRACTED]
  src/features/contact-messages/presentation/stores/contact-messages.store.ts → src/features/contact-messages/domain/entities/contact-message.entity.ts
- `useCurrentUser()` --calls--> `useAuthStore`  [EXTRACTED]
  src/shared/hooks/auth/use-auth-hooks.ts → src/features/authentication/presentation/stores/auth.store.ts
- `useSignIn()` --calls--> `useAuthStore`  [EXTRACTED]
  src/shared/hooks/auth/use-auth-hooks.ts → src/features/authentication/presentation/stores/auth.store.ts
- `SupabaseAuthRepository` --implements--> `IAuthRepository`  [EXTRACTED]
  src/features/authentication/data/repositories/supabase-auth.repository.ts → src/features/authentication/domain/repositories/i-auth.repository.ts
- `ChangePasswordModal()` --calls--> `useAuthStore`  [EXTRACTED]
  src/features/authentication/presentation/components/change-password-modal.tsx → src/features/authentication/presentation/stores/auth.store.ts

## Import Cycles
- None detected.

## Communities (21 total, 12 thin omitted)

### Community 0 - "contact-messages-table.tsx"
Cohesion: 0.14
Nodes (19): metadata, CONTACT_MESSAGE_STATUS_LABELS, CONTACT_MESSAGE_STATUS_VARIANTS, ContactMessageStatusEnum, ContactMessagesTable(), MessageDetailsDrawer(), MessageEmailReplyModal(), MessageReplyFormValues (+11 more)

### Community 1 - "ContactMessageStatus"
Cohesion: 0.13
Nodes (15): ForgotPasswordForm(), ForgotPasswordFormValues, forgotPasswordSchema, LoginForm(), LoginFormValues, loginSchema, ResetPasswordForm(), ResetPasswordFormValues (+7 more)

### Community 2 - "supabase-contact-messages.repository.ts"
Cohesion: 0.12
Nodes (8): Database, Enums, InsertTables, Json, Tables, UpdateTables, ContactMessageDTO, SupabaseDashboardRepository

### Community 3 - "use-contact-messages-hooks.ts"
Cohesion: 0.26
Nodes (11): ChangePasswordFormValues, ChangePasswordModal(), changePasswordSchema, AuthState, useAuthStore, useChangePassword(), useCurrentUser(), useSignOut() (+3 more)

### Community 4 - "IContactMessagesRepository"
Cohesion: 0.48
Nodes (6): config, intlMiddleware, isExcludedPath(), middleware(), PUBLIC_AUTH_ROUTES, PUBLIC_EXCLUDE_PATHS

### Community 8 - "i-contact-messages.repository.ts"
Cohesion: 0.08
Nodes (23): QueryKeys, ContactMessageEntity, ContactMessageProps, ContactMessageStatus, ContactMessageFilterParams, IContactMessagesRepository, PaginatedContactMessages, SendMessageReplyInput (+15 more)

### Community 9 - "admin-sidebar.tsx"
Cohesion: 0.40
Nodes (3): AdminSidebarProps, NAV_ITEMS, NavItem

### Community 10 - "UserProfileEntity"
Cohesion: 0.06
Nodes (24): AdminProfileDTO, AuthUserDTO, toUserProfileEntity(), SupabaseAuthRepository, UserProfileEntity, UserProfileProps, ChangePasswordInput, IAuthRepository (+16 more)

### Community 15 - "i18n.ts"
Cohesion: 0.40
Nodes (3): Locale, routing, RTL_LOCALES

## Knowledge Gaps
- **43 isolated node(s):** `routing`, `Locale`, `RTL_LOCALES`, `changePasswordSchema`, `ChangePasswordFormValues` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SupabaseHomepageRepository` connect `page.tsx` to `supabase-contact-messages.repository.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `QueryKeys` connect `i-contact-messages.repository.ts` to `UserProfileEntity`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `SupabaseAboutRepository` connect `i-auth.repository.ts` to `supabase-contact-messages.repository.ts`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `routing`, `Locale`, `RTL_LOCALES` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `contact-messages-table.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Should `ContactMessageStatus` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Should `supabase-contact-messages.repository.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11904761904761904 - nodes in this community are weakly interconnected._