// ==============================================================================
// features/homepage/domain/usecases/manage-clients.usecase.ts
// Use cases for Clients / Partners section management
// ==============================================================================
import type { ClientEntity } from "../entities/homepage.entity";
import type { IHomepageRepository } from "../repositories/i-homepage.repository";

export class GetClientsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(): Promise<ClientEntity[]> {
    return this.repo.getClients();
  }
}

export class CreateClientUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(client: Omit<ClientEntity, "id" | "createdAt" | "updatedAt">): Promise<ClientEntity> {
    const result = await this.repo.createClient(client);
    await this.repo.logActivity("created", "homepage", `Client Added: ${client.nameEn}`);
    return result;
  }
}

export class UpdateClientUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string, client: Partial<ClientEntity>): Promise<ClientEntity> {
    const result = await this.repo.updateClient(id, client);
    await this.repo.logActivity("updated", "homepage", `Client Updated: ${client.nameEn ?? id}`);
    return result;
  }
}

export class DeleteClientUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteClient(id);
    await this.repo.logActivity("deleted", "homepage", "Client Deleted");
  }
}

export class ReorderClientsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderClients(orderedIds);
    await this.repo.logActivity("updated", "homepage", "Clients Display Order Changed");
  }
}

export class BulkDeleteClientsUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteClients(ids);
    await this.repo.logActivity("deleted", "homepage", `Bulk Deleted ${ids.length} Clients`);
  }
}

export class BulkUpdateClientsStatusUseCase {
  constructor(private readonly repo: IHomepageRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateClientsStatus(ids, status);
    await this.repo.logActivity("updated", "homepage", `Bulk Updated ${ids.length} Clients to ${status}`);
  }
}
