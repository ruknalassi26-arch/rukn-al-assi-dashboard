// ==============================================================================
// features/vacation/domain/entities/vacation.entity.ts
// Vacation & Leave Domain Entities
// ==============================================================================

import type { EmployeeProfileEntity } from "./employee.entity";

export type VacationRequestStatus = "pending" | "approved" | "rejected" | "cancelled";
export type VacationUnit = "day" | "hour";

export interface VacationTypeProps {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  unit: VacationUnit;
  usesBalance: boolean;
  requiresApproval: boolean;
  isActive: boolean;
  sortOrder: number;
}

export class VacationTypeEntity {
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly unit: VacationUnit;
  public readonly usesBalance: boolean;
  public readonly requiresApproval: boolean;
  public readonly isActive: boolean;
  public readonly sortOrder: number;

  constructor(props: VacationTypeProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.description = props.description ?? null;
    this.unit = props.unit;
    this.usesBalance = props.usesBalance;
    this.requiresApproval = props.requiresApproval;
    this.isActive = props.isActive;
    this.sortOrder = props.sortOrder;
  }
}

export interface VacationBalanceProps {
  id: string;
  vacationTypeId: string;
  vacationType: {
    code: string;
    name: string;
  };
  periodStart: string;
  periodEnd: string;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
}

export class VacationBalanceEntity {
  public readonly id: string;
  public readonly vacationTypeId: string;
  public readonly vacationType: { code: string; name: string };
  public readonly periodStart: string;
  public readonly periodEnd: string;
  public readonly allocated: number;
  public readonly used: number;
  public readonly pending: number;
  public readonly remaining: number;

  constructor(props: VacationBalanceProps) {
    this.id = props.id;
    this.vacationTypeId = props.vacationTypeId;
    this.vacationType = props.vacationType;
    this.periodStart = props.periodStart;
    this.periodEnd = props.periodEnd;
    this.allocated = props.allocated;
    this.used = props.used;
    this.pending = props.pending;
    this.remaining = props.remaining;
  }
}

export interface VacationRequestProps {
  id: string;
  employeeId?: string;
  employee?: {
    id: string;
    fullName: string;
    email: string;
    department?: string | null;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  } | null;
  vacationTypeId?: string;
  vacationType?: {
    id?: string;
    code?: string;
    name: string;
  } | string;
  alternativeEmployeeId?: string | null;
  requestedDays: number;
  requestedHours: number;
  fromDate: string;
  toDate: string;
  returnToWorkDate: string;
  note?: string | null;
  status: VacationRequestStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewerNote?: string | null;
  createdAt: string;
}

export class VacationRequestEntity {
  public readonly id: string;
  public readonly employeeId: string | null;
  public readonly employee: {
    id: string;
    fullName: string;
    email: string;
    department: string | null;
    jobTitle: string | null;
    avatarUrl: string | null;
  } | null;
  public readonly vacationTypeId: string | null;
  public readonly vacationType: { id?: string; code?: string; name: string };
  public readonly alternativeEmployeeId: string | null;
  public readonly requestedDays: number;
  public readonly requestedHours: number;
  public readonly fromDate: string;
  public readonly toDate: string;
  public readonly returnToWorkDate: string;
  public readonly note: string | null;
  public readonly status: VacationRequestStatus;
  public readonly reviewedBy: string | null;
  public readonly reviewedAt: string | null;
  public readonly reviewerNote: string | null;
  public readonly createdAt: string;

  constructor(props: VacationRequestProps) {
    this.id = props.id;
    this.employeeId = props.employeeId ?? props.employee?.id ?? null;
    this.employee = props.employee
      ? {
          id: props.employee.id,
          fullName: props.employee.fullName,
          email: props.employee.email,
          department: props.employee.department ?? null,
          jobTitle: props.employee.jobTitle ?? null,
          avatarUrl: props.employee.avatarUrl ?? null,
        }
      : null;
    this.vacationTypeId = props.vacationTypeId ?? (typeof props.vacationType === "object" ? props.vacationType.id ?? null : null);
    this.vacationType =
      typeof props.vacationType === "string"
        ? { name: props.vacationType }
        : props.vacationType ?? { name: "Vacation" };
    this.alternativeEmployeeId = props.alternativeEmployeeId ?? null;
    this.requestedDays = Number(props.requestedDays) || 0;
    this.requestedHours = Number(props.requestedHours) || 0;
    this.fromDate = props.fromDate;
    this.toDate = props.toDate;
    this.returnToWorkDate = props.returnToWorkDate;
    this.note = props.note ?? null;
    this.status = props.status;
    this.reviewedBy = props.reviewedBy ?? null;
    this.reviewedAt = props.reviewedAt ?? null;
    this.reviewerNote = props.reviewerNote ?? null;
    this.createdAt = props.createdAt;
  }
}

export interface MyVacationDashboardProps {
  employee: {
    id: string;
    fullName: string;
    email: string;
    department?: string | null;
    jobTitle?: string | null;
    avatarUrl?: string | null;
  };
  summary: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  balances: VacationBalanceEntity[];
  recentRequests: VacationRequestEntity[];
}

export class MyVacationDashboardEntity {
  public readonly employee: {
    id: string;
    fullName: string;
    email: string;
    department: string | null;
    jobTitle: string | null;
    avatarUrl: string | null;
  };
  public readonly summary: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
  public readonly balances: VacationBalanceEntity[];
  public readonly recentRequests: VacationRequestEntity[];

  constructor(props: MyVacationDashboardProps) {
    this.employee = {
      id: props.employee.id,
      fullName: props.employee.fullName,
      email: props.employee.email,
      department: props.employee.department ?? null,
      jobTitle: props.employee.jobTitle ?? null,
      avatarUrl: props.employee.avatarUrl ?? null,
    };
    this.summary = props.summary;
    this.balances = props.balances;
    this.recentRequests = props.recentRequests;
  }
}
