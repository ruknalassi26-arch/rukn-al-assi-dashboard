// ==============================================================================
// features/activity-log/domain/entities/activity-log.entity.ts
// Activity Log Domain Entity Class
// ==============================================================================

export interface ActivityLogProps {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityTitle?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  ipAddress?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export class ActivityLogEntity {
  public readonly id: string;
  public readonly action: string;
  public readonly entityType: string;
  public readonly entityId: string | null;
  public readonly entityTitle: string | null;
  public readonly userId: string | null;
  public readonly userEmail: string | null;
  public readonly ipAddress: string | null;
  public readonly oldValue: unknown;
  public readonly newValue: unknown;
  public readonly metadata: Record<string, unknown> | null;
  public readonly createdAt: Date;

  constructor(props: ActivityLogProps) {
    this.id = props.id;
    this.action = props.action;
    this.entityType = props.entityType;
    this.entityId = props.entityId ?? null;
    this.entityTitle = props.entityTitle ?? null;
    this.userId = props.userId ?? null;
    this.userEmail = props.userEmail ?? null;
    this.ipAddress = props.ipAddress ?? null;
    this.oldValue = props.oldValue ?? null;
    this.newValue = props.newValue ?? null;
    this.metadata = props.metadata ?? null;
    this.createdAt = props.createdAt;
  }

  public get actionBadgeVariant(): "default" | "secondary" | "destructive" | "outline" {
    switch (this.action.toLowerCase()) {
      case "created":
      case "create":
        return "default";
      case "updated":
      case "update":
      case "seo_updated":
      case "settings_updated":
      case "password_changed":
        return "secondary";
      case "deleted":
      case "delete":
        return "destructive";
      case "login":
      case "logout":
      default:
        return "outline";
    }
  }

  public get actionFormattedLabel(): string {
    const act = this.action.toLowerCase();
    switch (act) {
      case "login":
        return "User Login";
      case "logout":
        return "User Logout";
      case "created":
      case "create":
        return "Created";
      case "updated":
      case "update":
        return "Updated";
      case "deleted":
      case "delete":
        return "Deleted";
      case "password_changed":
        return "Password Change";
      case "seo_updated":
        return "SEO Update";
      case "settings_updated":
        return "Settings Update";
      case "rfq_status_changed":
        return "RFQ Status Change";
      case "contact_updated":
        return "Contact Update";
      default:
        return this.action.replace(/_/g, " ").toUpperCase();
    }
  }

  public get entityFormattedLabel(): string {
    const ent = this.entityType.toLowerCase();
    switch (ent) {
      case "product":
        return "Product";
      case "category":
        return "Category";
      case "service":
        return "Service";
      case "project":
        return "Project";
      case "certificate":
        return "Certificate";
      case "team":
        return "Team Member";
      case "rfq":
        return "RFQ Request";
      case "contact":
      case "contact-messages":
        return "Contact Message";
      case "homepage":
        return "Homepage";
      case "settings":
        return "Website Settings";
      case "seo":
        return "SEO Settings";
      case "auth":
      case "profile":
        return "Authentication / Profile";
      default:
        return this.entityType.toUpperCase();
    }
  }

  /**
   * Helper to return combined old value from direct property or metadata
   */
  public get effectiveOldValue(): unknown {
    if (this.oldValue !== null && this.oldValue !== undefined) {
      return this.oldValue;
    }
    if (this.metadata && "old_value" in this.metadata) {
      return this.metadata.old_value;
    }
    if (this.metadata && "previous" in this.metadata) {
      return this.metadata.previous;
    }
    return null;
  }

  /**
   * Helper to return combined new value from direct property or metadata
   */
  public get effectiveNewValue(): unknown {
    if (this.newValue !== null && this.newValue !== undefined) {
      return this.newValue;
    }
    if (this.metadata && "new_value" in this.metadata) {
      return this.metadata.new_value;
    }
    if (this.metadata && "current" in this.metadata) {
      return this.metadata.current;
    }
    return null;
  }
}
