// ==============================================================================
// features/categories/domain/usecases/get-category-by-id.usecase.ts
// ==============================================================================
import type { ICategoryRepository } from "../repositories/i-category.repository";
import type { CategoryEntity } from "../entities/category.entity";

export class GetCategoryByIdUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(id: string): Promise<CategoryEntity | null> {
    return this.repository.getCategoryById(id);
  }
}
