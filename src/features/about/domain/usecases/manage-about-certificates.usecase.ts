// ==============================================================================
// features/about/domain/usecases/manage-about-certificates.usecase.ts
// Use cases for About Certificates management
// ==============================================================================
import type { AboutCertificateEntity, SectionStatus } from "../entities/about.entity";
import type { IAboutRepository, SaveCertificateInput } from "../repositories/i-about.repository";

export class GetAboutCertificatesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<AboutCertificateEntity[]> {
    return this.repo.getCertificates();
  }
}

export class CreateAboutCertificateUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(input: SaveCertificateInput): Promise<AboutCertificateEntity> {
    const result = await this.repo.createCertificate(input);
    await this.repo.logActivity("created", "certifications", "Certificate Created");
    return result;
  }
}

export class UpdateAboutCertificateUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, input: SaveCertificateInput): Promise<AboutCertificateEntity> {
    const result = await this.repo.updateCertificate(id, input);
    await this.repo.logActivity("updated", "certifications", "Certificate Updated");
    return result;
  }
}

export class DeleteAboutCertificateUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteCertificate(id);
    await this.repo.logActivity("deleted", "certifications", "Certificate Deleted");
  }
}

export class ReorderAboutCertificatesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderCertificates(orderedIds);
    await this.repo.logActivity("updated", "certifications", "Certificates Order Changed");
  }
}

export class BulkDeleteAboutCertificatesUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteCertificates(ids);
    await this.repo.logActivity("deleted", "certifications", `Bulk Delete ${ids.length} Certificates`);
  }
}

export class BulkUpdateAboutCertificatesStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: SectionStatus): Promise<void> {
    await this.repo.bulkUpdateCertificatesStatus(ids, status);
    await this.repo.logActivity("updated", "certifications", `Bulk Status ${status} Certificates`);
  }
}
