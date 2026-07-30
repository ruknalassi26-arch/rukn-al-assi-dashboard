// ==============================================================================
// features/about/domain/usecases/manage-about-certificates.usecase.ts
// Use cases for About Certificates management
// ==============================================================================
import type { AboutCertificateEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetAboutCertificatesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<AboutCertificateEntity[]> {
    return this.repo.getCertificates();
  }
}

export class CreateAboutCertificateUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(cert: Omit<AboutCertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<AboutCertificateEntity> {
    const result = await this.repo.createCertificate(cert);
    await this.repo.logActivity("created", "settings", `Certificate Created: ${cert.titleEn}`);
    return result;
  }
}

export class UpdateAboutCertificateUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, cert: Partial<AboutCertificateEntity>): Promise<AboutCertificateEntity> {
    const result = await this.repo.updateCertificate(id, cert);
    await this.repo.logActivity("updated", "settings", `Certificate Updated: ${cert.titleEn ?? id}`);
    return result;
  }
}

export class DeleteAboutCertificateUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteCertificate(id);
    await this.repo.logActivity("deleted", "settings", "Certificate Deleted");
  }
}

export class ReorderAboutCertificatesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderCertificates(orderedIds);
    await this.repo.logActivity("updated", "settings", "Certificates Order Changed");
  }
}

export class BulkDeleteAboutCertificatesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteCertificates(ids);
    await this.repo.logActivity("deleted", "settings", `Bulk Deleted ${ids.length} Certificates`);
  }
}

export class BulkUpdateAboutCertificatesStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateCertificatesStatus(ids, status);
    await this.repo.logActivity("updated", "settings", `Bulk Updated ${ids.length} Certificates to ${status}`);
  }
}
