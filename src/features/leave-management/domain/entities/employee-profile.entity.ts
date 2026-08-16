// ==============================================================================
// features/leave-management/domain/entities/employee-profile.entity.ts
// Domain entity for employee profile
// ==============================================================================

export interface EmployeeProfileEntity {
  id: string;
  authUserId?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  employmentStartDate?: string | null;
  isActive: boolean;
}
