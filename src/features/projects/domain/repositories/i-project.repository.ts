// ==============================================================================
// features/projects/domain/repositories/i-project.repository.ts
// IProjectRepository Contract Interface
// ==============================================================================
import type { ProjectEntity, ProjectStatus } from "../entities/project.entity";

export interface ProjectFilters {
  search?: string;
  categoryId?: string;
  status?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "created_at" | "title_en" | "sort_order";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedProjects {
  items: ProjectEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateProjectInput {
  slug: string;
  titleEn: string;
  titleAr: string;
  titleKu?: string | null;
  shortDescriptionEn?: string | null;
  shortDescriptionAr?: string | null;
  shortDescriptionKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  categoryId?: string | null;
  client?: string | null;
  location?: string | null;
  completionDate?: string | null;
  year?: number | null;
  coverImage?: string | null;
  images?: string[];
  status: ProjectStatus;
  isFeatured: boolean;
  sortOrder: number;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}

export interface IProjectRepository {
  getProjects(filters?: ProjectFilters): Promise<PaginatedProjects>;
  getProjectById(id: string): Promise<ProjectEntity | null>;
  createProject(input: CreateProjectInput): Promise<ProjectEntity>;
  updateProject(input: UpdateProjectInput): Promise<ProjectEntity>;
  deleteProject(id: string): Promise<void>;
  bulkDeleteProjects(ids: string[]): Promise<void>;
  toggleProjectStatus(id: string, status: ProjectStatus): Promise<ProjectEntity>;
  toggleProjectFeatured(id: string, isFeatured: boolean): Promise<ProjectEntity>;
}
