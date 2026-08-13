// ==============================================================================
// features/global-search/domain/entities/global-search.entity.ts
// Search Result Item Domain Entity Class
// ==============================================================================

export type SearchModuleType =
  | "products"
  | "categories"
  | "services"
  | "projects"
  | "certificates"
  | "team"
  | "rfq"
  | "contact"
  | "careers"
  | "branches"
  | "clients";

export interface SearchResultItemProps {
  id: string;
  module: SearchModuleType;
  title: string;
  description?: string | null;
  link: string;
  createdAt?: Date | null;
}

export class SearchResultItemEntity {
  public readonly id: string;
  public readonly module: SearchModuleType;
  public readonly title: string;
  public readonly description: string | null;
  public readonly link: string;
  public readonly createdAt: Date | null;

  constructor(props: SearchResultItemProps) {
    this.id = props.id;
    this.module = props.module;
    this.title = props.title;
    this.description = props.description ?? null;
    this.link = props.link;
    this.createdAt = props.createdAt ?? null;
  }

  public get moduleLabel(): string {
    switch (this.module) {
      case "products":
        return "Product";
      case "categories":
        return "Category";
      case "services":
        return "Service";
      case "projects":
        return "Project";
      case "certificates":
        return "Certificate";
      case "team":
        return "Team Member";
      case "rfq":
        return "RFQ Request";
      case "contact":
        return "Contact Message";
      case "careers":
        return "Job Posting";
      case "branches":
        return "Branch";
      case "clients":
        return "Client Partner";
      default:
        return String(this.module).toUpperCase();
    }
  }

  public get badgeVariant(): "default" | "secondary" | "destructive" | "outline" {
    switch (this.module) {
      case "products":
        return "default";
      case "services":
        return "secondary";
      case "rfq":
        return "outline";
      case "careers":
        return "secondary";
      case "branches":
        return "outline";
      case "clients":
        return "outline";
      default:
        return "secondary";
    }
  }
}
