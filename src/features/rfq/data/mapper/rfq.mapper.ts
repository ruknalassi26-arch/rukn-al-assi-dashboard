// ==============================================================================
// features/rfq/data/mapper/rfq.mapper.ts
// Maps between Supabase RFQ DTOs and RFQ Domain Entity Classes
// ==============================================================================
import { RfqRequestEntity } from "../../domain/entities/rfq-request.entity";
import type { RfqDTO } from "../dto/rfq.dto";

export function toRfqRequestEntity(dto: RfqDTO): RfqRequestEntity {
  return new RfqRequestEntity({
    id: dto.id,
    referenceNumber: dto.reference_number,
    companyName: dto.company_name,
    contactName: dto.contact_name || dto.full_name || "Customer",
    email: dto.email,
    phone: dto.phone,
    country: dto.country,
    productId: dto.product_id,
    productName: dto.product_name,
    quantity: dto.quantity,
    unit: dto.unit,
    requirements: dto.requirements,
    attachmentUrl: dto.attachment_url,
    status: dto.status,
    notes: dto.notes,
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
  });
}
