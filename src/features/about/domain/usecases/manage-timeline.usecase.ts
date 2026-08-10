// ==============================================================================
// features/about/domain/usecases/manage-timeline.usecase.ts
// Use cases for Company Timeline management
// ==============================================================================
import type { TimelineEntity, SectionStatus } from "../entities/about.entity";
import type { IAboutRepository, SaveTimelineInput } from "../repositories/i-about.repository";

export class GetTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(): Promise<TimelineEntity[]> {
    return this.repo.getTimeline();
  }
}

export class CreateTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(input: SaveTimelineInput): Promise<TimelineEntity> {
    const result = await this.repo.createTimeline(input);
    await this.repo.logActivity("created", "timeline_events", `Timeline Event Created (${input.eventYear})`);
    return result;
  }
}

export class UpdateTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string, input: SaveTimelineInput): Promise<TimelineEntity> {
    const result = await this.repo.updateTimeline(id, input);
    await this.repo.logActivity("updated", "timeline_events", `Timeline Event Updated (${input.eventYear})`);
    return result;
  }
}

export class DeleteTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.deleteTimeline(id);
    await this.repo.logActivity("deleted", "timeline_events", "Timeline Event Deleted");
  }
}

export class ReorderTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(orderedIds: string[]): Promise<void> {
    await this.repo.reorderTimeline(orderedIds);
    await this.repo.logActivity("updated", "timeline_events", "Timeline Events Order Changed");
  }
}

export class BulkDeleteTimelineUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[]): Promise<void> {
    await this.repo.bulkDeleteTimeline(ids);
    await this.repo.logActivity("deleted", "timeline_events", `Bulk Delete ${ids.length} Timeline Events`);
  }
}

export class BulkUpdateTimelineStatusUseCase {
  constructor(private readonly repo: IAboutRepository) {}
  async execute(ids: string[], status: SectionStatus): Promise<void> {
    await this.repo.bulkUpdateTimelineStatus(ids, status);
    await this.repo.logActivity("updated", "timeline_events", `Bulk Status ${status} Timeline Events`);
  }
}
