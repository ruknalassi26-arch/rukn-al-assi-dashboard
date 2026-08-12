// ==============================================================================
// features/rfq/domain/usecases/create-rfq.usecase.ts
// Use Case for Creating a new RFQ Request with Items & Attachments
// ==============================================================================
import type { IRfqRepository } from "../repositories/i-rfq.repository";
import type { CreateRfqInput, RfqRequestEntity } from "../entities/rfq-request.entity";

export class CreateRfqUseCase {
  constructor(private readonly rfqRepository: IRfqRepository) {}

  async execute(input: CreateRfqInput): Promise<RfqRequestEntity> {
    if (!input.fullName || !input.fullName.trim()) {
      throw new Error("Full Name is required.");
    }
    if (!input.phone || !input.phone.trim()) {
      throw new Error("Phone number is required.");
    }
    if (!input.address || !input.address.trim()) {
      throw new Error("Address is required.");
    }

    if (!input.items || input.items.length === 0) {
      throw new Error("At least one RFQ item is required.");
    }

    for (const item of input.items) {
      if (!item.quantity || item.quantity <= 0) {
        throw new Error("Quantity must be at least 1 for all items.");
      }
      if (item.itemType === "product" && !item.productId) {
        throw new Error("Please select a product for all product items.");
      }
      if (item.itemType === "service" && !item.serviceId) {
        throw new Error("Please select a service for all service items.");
      }
    }

    return this.rfqRepository.createRfq(input);
  }

  async uploadAttachment(file: File) {
    if (!file) throw new Error("File is required");
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      throw new Error("File size exceeds 20MB limit.");
    }
    return this.rfqRepository.uploadAttachment(file);
  }
}
