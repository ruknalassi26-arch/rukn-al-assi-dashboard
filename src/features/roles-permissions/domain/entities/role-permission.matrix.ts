// ==============================================================================
// features/roles-permissions/domain/entities/role-permission.matrix.ts
// Predefined Role-to-Permission Mapping Matrix & Built-in Templates
// ==============================================================================
import { ALL_RESOURCES, type PermissionCode, type ResourceCode } from "./role.enums";

export const ALL_PERMISSIONS: PermissionCode[] = ALL_RESOURCES.flatMap((resource) => [
  `${resource}:view` as PermissionCode,
  `${resource}:manage` as PermissionCode,
]);

export interface RoleTemplate {
  name: string;
  slug: string;
  description: string;
  permissions: PermissionCode[];
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    name: "Super Admin",
    slug: "super_admin",
    description: "Full access to everything across the admin portal.",
    permissions: ALL_PERMISSIONS,
  },
  {
    name: "Editor",
    slug: "editor",
    description: "Can manage website content, services, products, projects, careers, contact, media, and SEO. Cannot manage users, roles, settings, activity logs, or analytics.",
    permissions: [
      "dashboard:view", "dashboard:manage",
      "about:view", "about:manage",
      "homepage:view", "homepage:manage",
      "services:view", "services:manage",
      "products:view", "products:manage",
      "projects:view", "projects:manage",
      "branches:view", "branches:manage",
      "careers:view", "careers:manage",
      "contact:view", "contact:manage",
      "media:view", "media:manage",
      "seo:view", "seo:manage",
      "messages:view", "messages:manage",
      "notifications:view", "notifications:manage",
      "rfq:view", "rfq:manage",
    ],
  },
  {
    name: "Viewer",
    slug: "viewer",
    description: "View-only access to permitted modules. Cannot modify or manage data.",
    permissions: ALL_RESOURCES.map((r) => `${r}:view` as PermissionCode),
  },
  {
    name: "HR Manager",
    slug: "hr_manager",
    description: "Can manage dashboard, employees, vacations, and career applications, view analytics. Cannot access roles, users, or settings.",
    permissions: [
      "dashboard:view", "dashboard:manage",
      "employees:view", "employees:manage",
      "vacation:view", "vacation:manage",
      "careers:view", "careers:manage",
      "analytics:view",
    ],
  },
  {
    name: "Content Manager",
    slug: "content_manager",
    description: "Can manage about, homepage, services, products, projects, media, and SEO content.",
    permissions: [
      "about:view", "about:manage",
      "homepage:view", "homepage:manage",
      "services:view", "services:manage",
      "products:view", "products:manage",
      "projects:view", "projects:manage",
      "media:view", "media:manage",
      "seo:view", "seo:manage",
    ],
  },
];

export const ROLE_PERMISSION_MATRIX: Record<string, PermissionCode[]> = {
  super_admin: ALL_PERMISSIONS,
  editor: ROLE_TEMPLATES[1].permissions,
  viewer: ROLE_TEMPLATES[2].permissions,
  hr_manager: ROLE_TEMPLATES[3].permissions,
  content_manager: ROLE_TEMPLATES[4].permissions,
};
