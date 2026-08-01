// ==============================================================================
// features/notifications/domain/entities/notification.entity.ts
// Notification Domain Entity Class
// ==============================================================================

export type NotificationType = "rfq_new" | "contact_new" | "system" | "email_failure" | "admin_login";

export interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  userId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export class NotificationEntity {
  public readonly id: string;
  public readonly type: NotificationType;
  public readonly title: string;
  public readonly message: string;
  public readonly link: string | null;
  public readonly isRead: boolean;
  public readonly userId: string | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly createdAt: Date;

  constructor(props: NotificationProps) {
    this.id = props.id;
    this.type = props.type;
    this.title = props.title;
    this.message = props.message;
    this.link = props.link ?? null;
    this.isRead = props.isRead;
    this.userId = props.userId ?? null;
    this.metadata = props.metadata ?? null;
    this.createdAt = props.createdAt;
  }

  public get typeLabel(): string {
    switch (this.type) {
      case "rfq_new":
        return "New RFQ Request";
      case "contact_new":
        return "New Contact Message";
      case "system":
        return "System Notification";
      case "email_failure":
        return "Email Delivery Failure";
      case "admin_login":
        return "Admin Login Event";
      default:
        return "Notification";
    }
  }

  public get badgeVariant(): "default" | "secondary" | "destructive" | "outline" {
    switch (this.type) {
      case "rfq_new":
        return "default";
      case "contact_new":
        return "secondary";
      case "email_failure":
        return "destructive";
      case "admin_login":
      case "system":
      default:
        return "outline";
    }
  }

  public get timeAgo(): string {
    const seconds = Math.floor((new Date().getTime() - new Date(this.createdAt).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
}
