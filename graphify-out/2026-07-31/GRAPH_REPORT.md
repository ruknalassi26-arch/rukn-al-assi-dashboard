# Graph Report - rukn-al-assi-dashboard  (2026-07-31)

## Corpus Check
- 493 files · ~109,723 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 114 nodes · 258 edges · 12 communities (7 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81bec660`
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
- DeleteContactMessageUseCase
- SendMessageReplyUseCase

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
10. `toContactMessageEntity()` - 5 edges

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

## Communities (12 total, 5 thin omitted)

### Community 0 - "contact-messages-table.tsx"
Cohesion: 0.19
Nodes (16): CONTACT_MESSAGE_STATUS_LABELS, CONTACT_MESSAGE_STATUS_VARIANTS, ContactMessageStatusEnum, ContactMessagesTable(), MessageDetailsDrawer(), MessageEmailReplyModal(), MessageReplyFormValues, messageReplySchema (+8 more)

### Community 1 - "ContactMessageStatus"
Cohesion: 0.19
Nodes (4): ContactMessageEntity, ContactMessageStatus, UpdateMessageStatusUseCase, ContactMessagesState

### Community 2 - "supabase-contact-messages.repository.ts"
Cohesion: 0.21
Nodes (9): Database, Enums, InsertTables, Json, Tables, UpdateTables, ContactMessageDTO, toContactMessageEntity() (+1 more)

### Community 3 - "use-contact-messages-hooks.ts"
Cohesion: 0.17
Nodes (10): QueryKeys, BulkUpdateMessageStatusUseCase, bulkDeleteMessagesUseCase, bulkUpdateMessageStatusUseCase, deleteContactMessageUseCase, getContactMessageByIdUseCase, getContactMessagesUseCase, repository (+2 more)

### Community 4 - "IContactMessagesRepository"
Cohesion: 0.27
Nodes (3): IContactMessagesRepository, BulkDeleteMessagesUseCase, GetContactMessageByIdUseCase

### Community 6 - "ContactMessageFilterParams"
Cohesion: 0.43
Nodes (3): ContactMessageFilterParams, PaginatedContactMessages, GetContactMessagesUseCase

### Community 9 - "admin-sidebar.tsx"
Cohesion: 0.40
Nodes (3): AdminSidebarProps, NAV_ITEMS, NavItem

## Knowledge Gaps
- **21 isolated node(s):** `metadata`, `Json`, `Database`, `InsertTables`, `UpdateTables` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `IContactMessagesRepository` connect `IContactMessagesRepository` to `ContactMessageStatus`, `supabase-contact-messages.repository.ts`, `use-contact-messages-hooks.ts`, `SupabaseContactMessagesRepository`, `ContactMessageFilterParams`, `i-contact-messages.repository.ts`, `DeleteContactMessageUseCase`, `SendMessageReplyUseCase`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `ContactMessageEntity` connect `ContactMessageStatus` to `contact-messages-table.tsx`, `supabase-contact-messages.repository.ts`, `IContactMessagesRepository`, `SupabaseContactMessagesRepository`, `ContactMessageFilterParams`, `i-contact-messages.repository.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `ContactMessageStatus` connect `ContactMessageStatus` to `contact-messages-table.tsx`, `supabase-contact-messages.repository.ts`, `use-contact-messages-hooks.ts`, `IContactMessagesRepository`, `SupabaseContactMessagesRepository`, `ContactMessageFilterParams`, `i-contact-messages.repository.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `metadata`, `Json`, `Database` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._