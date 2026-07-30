// ==============================================================================
// features/categories/domain/usecases/delete-category.usecase.ts
// ==============================================================================
import type { ICategoryRepository } from "../repositories/i-category.repository";

export class DeleteCategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteCategory(id);
  }
}
