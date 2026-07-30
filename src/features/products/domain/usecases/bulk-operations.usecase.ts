// ==============================================================================
// features/products/domain/usecases/bulk-operations.usecase.ts
// ==============================================================================
import type { IProductRepository } from "../repositories/i-product.repository";
import type { ProductStatus } from "../entities/product.entity";

export class BulkDeleteProductsUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteProducts(ids);
  }
}

export class BulkUpdateProductStatusUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(ids: string[], status: ProductStatus): Promise<void> {
    return this.repository.bulkUpdateProductStatus(ids, status);
  }
}

export class GetProductCategoriesUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute() {
    return this.repository.getCategories();
  }
}
