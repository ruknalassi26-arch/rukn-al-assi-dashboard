// ==============================================================================
// features/categories/domain/usecases/get-categories.usecase.ts
// ==============================================================================
import type { ICategoryRepository, CategoryFilterParams, PaginatedCategories } from "../repositories/i-category.repository";

export class GetCategoriesUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(params?: CategoryFilterParams): Promise<PaginatedCategories> {
    return this.repository.getCategories(params);
  }
}
