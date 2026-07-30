// ==============================================================================
// features/certificates/domain/usecases/bulk-operations.usecase.ts
// ==============================================================================
import type { ICertificateRepository } from "../repositories/i-certificate.repository";
import type { CertificateStatus } from "../entities/certificate.entity";

export class BulkDeleteCertificatesUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(ids: string[]): Promise<void> {
    return this.repository.bulkDeleteCertificates(ids);
  }
}

export class BulkUpdateCertificateStatusUseCase {
  constructor(private readonly repository: ICertificateRepository) {}

  async execute(ids: string[], status: CertificateStatus): Promise<void> {
    return this.repository.bulkUpdateCertificateStatus(ids, status);
  }
}
