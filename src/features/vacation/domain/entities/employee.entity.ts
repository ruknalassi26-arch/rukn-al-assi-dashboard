// ==============================================================================
// features/vacation/domain/entities/employee.entity.ts
// Employee Profile Domain Entity Class
// ==============================================================================

export interface EmployeeProfileProps {
  id: string;
  authUserId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  employmentStartDate?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export class EmployeeProfileEntity {
  public readonly id: string;
  public readonly authUserId: string;
  public readonly fullName: string;
  public readonly email: string;
  public readonly phone: string | null;
  public readonly department: string | null;
  public readonly jobTitle: string | null;
  public readonly employmentStartDate: string | null;
  public readonly avatarUrl: string | null;
  public readonly isActive: boolean;
  public readonly createdAt: string | null;

  constructor(props: EmployeeProfileProps) {
    this.id = props.id;
    this.authUserId = props.authUserId;
    this.fullName = props.fullName;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.department = props.department ?? null;
    this.jobTitle = props.jobTitle ?? null;
    this.employmentStartDate = props.employmentStartDate ?? null;
    this.avatarUrl = props.avatarUrl ?? null;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? null;
  }
}
