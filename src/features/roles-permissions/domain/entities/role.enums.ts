// ==============================================================================
// features/roles-permissions/domain/entities/role.enums.ts
// Enums for System Roles and Module Permissions
// ==============================================================================

export type RoleCode = "super_admin" | "admin" | "editor" | "viewer";

export type ModuleCode =
  | "dashboard"
  | "products"
  | "categories"
  | "services"
  | "projects"
  | "certificates"
  | "team"
  | "contact"
  | "rfq"
  | "seo"
  | "settings"
  | "users"
  | "activity_log";

export type PermissionCode =
  // Dashboard
  | "dashboard:view"
  // Products
  | "products:view"
  | "products:create"
  | "products:edit"
  | "products:delete"
  // Categories
  | "categories:view"
  | "categories:create"
  | "categories:edit"
  | "categories:delete"
  // Services
  | "services:view"
  | "services:create"
  | "services:edit"
  | "services:delete"
  // Projects
  | "projects:view"
  | "projects:create"
  | "projects:edit"
  | "projects:delete"
  // Certificates
  | "certificates:view"
  | "certificates:create"
  | "certificates:edit"
  | "certificates:delete"
  // Team Members
  | "team:view"
  | "team:create"
  | "team:edit"
  | "team:delete"
  // Contact
  | "contact:view"
  | "contact:edit"
  | "contact:messages"
  // RFQ
  | "rfq:view"
  | "rfq:update_status"
  // SEO
  | "seo:view"
  | "seo:edit"
  // Settings
  | "settings:view"
  | "settings:edit"
  // Users
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  // Activity Log
  | "activity_log:view";
