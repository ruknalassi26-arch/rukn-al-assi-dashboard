// ==============================================================================
// features/products/domain/usecases/get-product-by-id.usecase.ts
// ==============================================================================
import type { IProductRepository } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class GetProductByIdUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string): Promise<ProductEntity | null> {
    return this.repository.getProductById(id);
  }
}
