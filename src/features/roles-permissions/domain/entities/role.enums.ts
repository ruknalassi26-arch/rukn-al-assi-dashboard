// ==============================================================================
// features/roles-permissions/domain/entities/role.enums.ts
// Enums for System Roles, Resources, and Permission Actions
// ==============================================================================

export type RoleCode = "super_admin" | "admin" | "editor" | "viewer" | "hr_manager" | "content_manager" | string;

export type ResourceCode =
  | "dashboard"
  | "about"
  | "homepage"
  | "services"
  | "products"
  | "projects"
  | "branches"
  | "careers"
  | "contact"
  | "media"
  | "seo"
  | "analytics"
  | "messages"
  | "notifications"
  | "rfq"
  | "users"
  | "roles"
  | "settings"
  | "activity_log"
  | "audit"
  | string;

export type ModuleCode = ResourceCode;

export type PermissionAction = "view" | "manage" | "create" | "edit" | "delete" | "update_status";

export type PermissionCode = `${ResourceCode}:${PermissionAction}` | string;

export const ALL_RESOURCES: ResourceCode[] = [
  "dashboard",
  "about",
  "homepage",
  "services",
  "products",
  "projects",
  "branches",
  "careers",
  "contact",
  "media",
  "seo",
  "analytics",
  "messages",
  "notifications",
  "rfq",
  "users",
  "roles",
  "settings",
  "activity_log",
];
