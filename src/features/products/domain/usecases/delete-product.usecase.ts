// ==============================================================================
// features/products/domain/usecases/delete-product.usecase.ts
// ==============================================================================
import type { IProductRepository } from "../repositories/i-product.repository";

export class DeleteProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteProduct(id);
  }
}
