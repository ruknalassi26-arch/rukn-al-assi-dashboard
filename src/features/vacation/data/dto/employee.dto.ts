// ==============================================================================
// features/vacation/data/dto/employee.dto.ts
// Employee Data Transfer Objects
// ==============================================================================

export interface EmployeeProfileDto {
  id: string;
  authUserId?: string;
  auth_user_id?: string;
  fullName?: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  job_title?: string | null;
  employmentStartDate?: string | null;
  employment_start_date?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  created_at?: string;
}
