// ==============================================================================
// features/contact-messages/data/mapper/contact-message.mapper.ts
// Maps between Supabase DTOs and ContactMessage Domain Entity Classes
// ==============================================================================
import { ContactMessageEntity } from "../../domain/entities/contact-message.entity";
import type { ContactMessageDTO } from "../dto/contact-message.dto";

export function toContactMessageEntity(dto: ContactMessageDTO): ContactMessageEntity {
  return new ContactMessageEntity({
    id: dto.id,
    name: dto.name,
    email: dto.email,
    phone: dto.phone,
    subject: dto.subject,
    message: dto.message,
    status: dto.status,
    attachmentUrl: dto.attachment_url ?? null,
    notes: dto.notes ?? null,
    createdAt: new Date(dto.created_at),
  });
}
