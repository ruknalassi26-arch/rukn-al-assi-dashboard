// ==============================================================================
// features/roles-permissions/domain/entities/permission.entity.ts
// Permission Domain Entity Class
// ==============================================================================
import type { PermissionCode, ModuleCode } from "./role.enums";

export interface PermissionProps {
  id: string;
  code: PermissionCode;
  name: string;
  module: ModuleCode;
  description?: string | null;
}

export class PermissionEntity {
  public readonly id: string;
  public readonly code: PermissionCode;
  public readonly name: string;
  public readonly module: ModuleCode;
  public readonly description: string | null;

  constructor(props: PermissionProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.module = props.module;
    this.description = props.description ?? null;
  }
}
