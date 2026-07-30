// ==============================================================================
// features/about/domain/usecases/manage-timeline.usecase.ts
// Use cases for Company Timeline management
// ==============================================================================
import type { TimelineEntity } from "../entities/about.entity";
import type { IAboutRepository } from "../repositories/i-about.repository";

export class GetTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<TimelineEntity[]> {
    return this.repo.getTimeline();
  }
}

export class CreateTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(item: Omit<TimelineEntity, "id" | "createdAt" | "updatedAt">): Promise<TimelineEntity> {
    const result = await this.repo.createTimeline(item);
    await this.repo.logActivity("created", "settings", `Timeline Event Created: ${item.year} - ${item.titleEn}`);
    return result;
  }
}

export class UpdateTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, item: Partial<TimelineEntity>): Promise<TimelineEntity> {
    const result = await this.repo.updateTimeline(id, item);
    await this.repo.logActivity("updated", "settings", `Timeline Event Updated: ${item.titleEn ?? id}`);
    return result;
  }
}

export class DeleteTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteTimeline(id);
    await this.repo.logActivity("deleted", "settings", "Timeline Event Deleted");
  }
}

export class ReorderTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderTimeline(orderedIds);
    await this.repo.logActivity("updated", "settings", "Timeline Events Order Changed");
  }
}

export class BulkDeleteTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteTimeline(ids);
    await this.repo.logActivity("deleted", "settings", `Bulk Deleted ${ids.length} Timeline Events`);
  }
}

export class BulkUpdateTimelineStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: "active" | "draft"): Promise<void> {
    await this.repo.bulkUpdateTimelineStatus(ids, status);
    await this.repo.logActivity("updated", "settings", `Bulk Updated ${ids.length} Timeline Events to ${status}`);
  }
}
