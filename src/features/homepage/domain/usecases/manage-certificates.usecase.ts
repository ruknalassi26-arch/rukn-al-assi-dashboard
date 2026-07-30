// ==============================================================================
// features/homepage/domain/usecases/manage-certificates.usecase.ts
// Use cases for Certificates & Accreditations section management
// ==============================================================================
import type { CertificateEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetCertificatesUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<CertificateEntity[]> {
    return this.repo.getCertificates();
  }
}

export class CreateCertificateUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(certificate: Omit<CertificateEntity, "id" | "createdAt" | "updatedAt">): Promise<CertificateEntity> {
    const result = await this.repo.createCertificate(certificate);
    await this.repo.logActivity("created", "homepage", `Certificate Added: ${certificate.titleEn}`);
    return result;
  }
}

export class UpdateCertificateUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, certificate: Partial<CertificateEntity>): Promise<CertificateEntity> {
    const result = await this.repo.updateCertificate(id, certificate);
    await this.repo.logActivity("updated", "homepage", `Certificate Updated: ${certificate.titleEn ?? id}`);
    return result;
  }
}

export class DeleteCertificateUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteCertificate(id);
    await this.repo.logActivity("deleted", "homepage", "Certificate Deleted");
  }
}

export class ReorderCertificatesUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderCertificates(orderedIds);
    await this.repo.logActivity("updated", "homepage", "Certificates Order Changed");
  }
}

export class BulkDeleteCertificatesUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteCertificates(ids);
    await this.repo.logActivity("deleted", "homepage", `Bulk Deleted ${ids.length} Certificates`);
  }
}

export class BulkUpdateCertificatesStatusUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateCertificatesStatus(ids, status);
    await this.repo.logActivity("updated", "homepage", `Bulk Updated ${ids.length} Certificates to ${status}`);
  }
}
