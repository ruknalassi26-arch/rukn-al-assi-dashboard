# Graph Report - rukn-al-assi-dashboard  (2026-07-31)

## Corpus Check
- 495 files · ~110,225 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 124 nodes · 266 edges · 11 communities (6 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a0faa581`
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
2. `ContactMessageStatus` - 18 edges
3. `ContactMessageEntity` - 17 edges
4. `SupabaseContactMessagesRepository` - 12 edges
5. `ContactMessageFilterParams` - 7 edges
6. `ContactMessagesTable()` - 7 edges
7. `useContactMessagesStore` - 7 edges
8. `PaginatedContactMessages` - 6 edges
9. `SendMessageReplyInput` - 6 edges
10. `UserProfileEntity` - 5 edges

## Surprising Connections (you probably didn't know these)
- `SupabaseContactMessagesRepository` --implements--> `IContactMessagesRepository`  [EXTRACTED]
  src/features/contact-messages/data/repositories/supabase-contact-messages.repository.ts → src/features/contact-messages/domain/repositories/i-contact-messages.repository.ts
- `ContactMessageFilterParams` --references--> `ContactMessageStatus`  [EXTRACTED]
  src/features/contact-messages/domain/repositories/i-contact-messages.repository.ts → src/features/contact-messages/domain/entities/contact-message.entity.ts
- `ContactMessagesState` --references--> `ContactMessageStatus`  [EXTRACTED]
  src/features/contact-messages/presentation/stores/contact-messages.store.ts → src/features/contact-messages/domain/entities/contact-message.entity.ts
- `PaginatedContactMessages` --references--> `ContactMessageEntity`  [EXTRACTED]
  src/features/contact-messages/domain/repositories/i-contact-messages.repository.ts → src/features/contact-messages/domain/entities/contact-message.entity.ts
- `ContactMessagesTable()` --calls--> `useContactMessagesStore`  [EXTRACTED]
  src/features/contact-messages/presentation/components/contact-messages-table.tsx → src/features/contact-messages/presentation/stores/contact-messages.store.ts

## Import Cycles
- None detected.

## Communities (11 total, 5 thin omitted)

### Community 0 - "contact-messages-table.tsx"
Cohesion: 0.19
Nodes (16): CONTACT_MESSAGE_STATUS_LABELS, CONTACT_MESSAGE_STATUS_VARIANTS, ContactMessageStatusEnum, ContactMessagesTable(), MessageDetailsDrawer(), MessageEmailReplyModal(), MessageReplyFormValues, messageReplySchema (+8 more)

### Community 2 - "supabase-contact-messages.repository.ts"
Cohesion: 0.21
Nodes (9): Database, Enums, InsertTables, Json, Tables, UpdateTables, ContactMessageDTO, toContactMessageEntity() (+1 more)

### Community 3 - "use-contact-messages-hooks.ts"
Cohesion: 0.14
Nodes (10): QueryKeys, BulkDeleteMessagesUseCase, bulkDeleteMessagesUseCase, bulkUpdateMessageStatusUseCase, deleteContactMessageUseCase, getContactMessageByIdUseCase, getContactMessagesUseCase, repository (+2 more)

### Community 4 - "IContactMessagesRepository"
Cohesion: 0.38
Nodes (3): ContactMessageStatus, BulkUpdateMessageStatusUseCase, ContactMessagesState

### Community 8 - "i-contact-messages.repository.ts"
Cohesion: 0.15
Nodes (8): ContactMessageFilterParams, IContactMessagesRepository, PaginatedContactMessages, SendMessageReplyInput, DeleteContactMessageUseCase, GetContactMessagesUseCase, SendMessageReplyUseCase, UpdateMessageStatusUseCase

### Community 9 - "admin-sidebar.tsx"
Cohesion: 0.40
Nodes (3): AdminSidebarProps, NAV_ITEMS, NavItem

## Knowledge Gaps
- **23 isolated node(s):** `UserProfileProps`, `NavItem`, `NAV_ITEMS`, `AdminSidebarProps`, `metadata` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IContactMessagesRepository` connect `i-contact-messages.repository.ts` to `ContactMessageStatus`, `supabase-contact-messages.repository.ts`, `use-contact-messages-hooks.ts`, `IContactMessagesRepository`, `SupabaseContactMessagesRepository`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `ContactMessageEntity` connect `ContactMessageStatus` to `i-contact-messages.repository.ts`, `contact-messages-table.tsx`, `supabase-contact-messages.repository.ts`, `SupabaseContactMessagesRepository`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `ContactMessageStatus` connect `IContactMessagesRepository` to `contact-messages-table.tsx`, `ContactMessageStatus`, `supabase-contact-messages.repository.ts`, `use-contact-messages-hooks.ts`, `SupabaseContactMessagesRepository`, `i-contact-messages.repository.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `UserProfileProps`, `NavItem`, `NAV_ITEMS` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `use-contact-messages-hooks.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._