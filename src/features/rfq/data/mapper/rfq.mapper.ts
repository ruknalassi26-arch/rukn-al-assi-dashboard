// ==============================================================================
// features/rfq/data/mapper/rfq.mapper.ts
// Maps between Supabase RFQ DTOs and RFQ Domain Entity Classes
// ==============================================================================
import { RfqRequestEntity } from "../../domain/entities/rfq-request.entity";
import type { RfqItemEntity, RfqAttachmentEntity } from "../../domain/entities/rfq-request.entity";
import type { RfqJoinDTO, RfqItemWithRelationDTO, RfqAttachmentDTO } from "../dto/rfq.dto";

export function toRfqItemEntity(dto: RfqItemWithRelationDTO): RfqItemEntity {
  let productName: string | null = null;
  if (dto.products?.product_translations?.length) {
    const enTrans = dto.products.product_translations.find((t) => t.language_code === "en");
    productName = enTrans?.name || dto.products.product_translations[0]?.name || null;
  }

  let serviceName: string | null = null;
  if (dto.services?.service_translations?.length) {
    const enTrans = dto.services.service_translations.find((t) => t.language_code === "en");
    serviceName = enTrans?.name || dto.services.service_translations[0]?.name || null;
  }

  return {
    id: dto.id,
    rfqId: dto.rfq_id,
    itemType: dto.item_type,
    productId: dto.product_id,
    serviceId: dto.service_id,
    productName,
    serviceName,
    quantity: dto.quantity ?? 1,
    notes: dto.notes ?? null,
    createdAt: dto.created_at ? new Date(dto.created_at) : undefined,
  };
}

export function toRfqAttachmentEntity(dto: RfqAttachmentDTO): RfqAttachmentEntity {
  return {
    id: dto.id,
    rfqId: dto.rfq_id,
    fileUrl: dto.file_url,
    fileName: dto.file_name,
    mimeType: dto.mime_type ?? null,
    fileSizeKb: dto.file_size_kb ?? null,
    createdAt: dto.created_at ? new Date(dto.created_at) : undefined,
  };
}

export function toRfqRequestEntity(dto: RfqJoinDTO): RfqRequestEntity {
  const items = (dto.rfq_items ?? []).map(toRfqItemEntity);
  const attachments = (dto.rfq_attachments ?? []).map(toRfqAttachmentEntity);

  return new RfqRequestEntity({
    id: dto.id,
    fullName: dto.full_name,
    companyName: dto.company_name,
    phone: dto.phone,
    address: dto.address,
    notes: dto.notes,
    status: dto.status ?? "new",
    createdAt: new Date(dto.created_at),
    updatedAt: new Date(dto.updated_at),
    items,
    attachments,
  });
}
