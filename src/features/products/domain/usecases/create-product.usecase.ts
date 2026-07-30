// ==============================================================================
// features/products/domain/usecases/create-product.usecase.ts
// ==============================================================================
import type { IProductRepository, CreateProductInput } from "../repositories/i-product.repository";
import type { ProductEntity } from "../entities/product.entity";

export class CreateProductUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<ProductEntity> {
    const isUnique = await this.repository.checkSlugUnique(input.slug);
    if (!isUnique) {
      throw new Error(`Slug "${input.slug}" is already in use by another product.`);
    }
    return this.repository.createProduct(input);
  }
}
