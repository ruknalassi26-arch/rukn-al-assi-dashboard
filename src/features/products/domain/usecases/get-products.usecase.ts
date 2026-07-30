// ==============================================================================
// features/products/domain/usecases/get-products.usecase.ts
// ==============================================================================
import type { IProductRepository, ProductFilterParams, PaginatedProducts } from "../repositories/i-product.repository";

export class GetProductsUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(params?: ProductFilterParams): Promise<PaginatedProducts> {
    return this.repository.getProducts(params);
  }
}
