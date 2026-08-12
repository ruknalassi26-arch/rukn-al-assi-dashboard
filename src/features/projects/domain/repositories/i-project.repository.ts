// ==============================================================================
// features/projects/domain/repositories/i-project.repository.ts
// IProjectRepository Contract Interface strictly matching Supabase SQL Schema
// ==============================================================================
import type { ProjectEntity, ProjectStatus } from "../entities/project.entity";

export interface ProjectFilters {
  search?: string;
  categoryId?: string;
  status?: ProjectStatus | "all";
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
  categoryId?: string | null;
  clientName?: string | null;
  location?: string | null;
  completionDate?: string | null;
  status: ProjectStatus;
  isFeatured?: boolean;
  featuredOrder?: number;
  sortOrder?: number;

  // Multilingual
  titleEn: string;
  titleAr?: string | null;
  titleKu?: string | null;
  slugEn?: string | null;
  slugAr?: string | null;
  slugKu?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  descriptionKu?: string | null;
  challengeEn?: string | null;
  challengeAr?: string | null;
  challengeKu?: string | null;
  solutionEn?: string | null;
  solutionAr?: string | null;
  solutionKu?: string | null;

  // Images
  images?: string[];
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
