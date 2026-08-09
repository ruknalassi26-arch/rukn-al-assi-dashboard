// ==============================================================================
// features/languages/data/repositories/supabase-language.repository.ts
// Supabase Implementation of ILanguageRepository
// ==============================================================================
import { createClient } from "@core/lib/supabase/client";
import type { UpdateTables } from "@core/types/database.types";
import type {
  ILanguageRepository,
  CreateLanguageInput,
  UpdateLanguageInput,
} from "../../domain/repositories/i-language.repository";
import { LanguageEntity } from "../../domain/entities/language.entity";
import { LanguageMapper } from "../mapper/language.mapper";

export class SupabaseLanguageRepository implements ILanguageRepository {
  private get supabase() {
    return createClient();
  }

  private async logActivity(action: string, entityId: string, metadata?: Record<string, unknown>): Promise<void> {
    try {
      const { data: userData } = await this.supabase.auth.getUser();
      await this.supabase.from("activity_log").insert({
        action,
        entity_type: "settings",
        entity_id: entityId,
        details: { entity_title: `Language: ${entityId}`, ...metadata },
        admin_user_id: userData.user?.id ?? null,
      });
    } catch {
      // Non-blocking log
    }
  }

  async getLanguages(): Promise<LanguageEntity[]> {
    const { data, error } = await this.supabase
      .from("languages")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("code", { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(LanguageMapper.toDomain);
  }

  async getLanguageByCode(code: string): Promise<LanguageEntity | null> {
    const { data, error } = await this.supabase
      .from("languages")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    return LanguageMapper.toDomain(data);
  }

  async createLanguage(input: CreateLanguageInput): Promise<LanguageEntity> {
    const { data, error } = await this.supabase
      .from("languages")
      .insert({
        code: input.code.toLowerCase().trim(),
        name: input.name.trim(),
        native_name: input.nativeName.trim(),
        is_rtl: input.isRtl,
        is_required: input.isRequired,
        is_active: input.isActive ?? true,
        sort_order: input.sortOrder ?? 0,
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    const entity = LanguageMapper.toDomain(data);
    await this.logActivity("created", entity.code, { name: entity.name });
    return entity;
  }

  async updateLanguage(code: string, input: UpdateLanguageInput): Promise<LanguageEntity> {
    const payload: UpdateTables<"languages"> = {};
    if (input.name !== undefined) payload.name = input.name;
    if (input.nativeName !== undefined) payload.native_name = input.nativeName;
    if (input.isRtl !== undefined) payload.is_rtl = input.isRtl;
    if (input.isRequired !== undefined) payload.is_required = input.isRequired;
    if (input.isActive !== undefined) payload.is_active = input.isActive;
    if (input.sortOrder !== undefined) payload.sort_order = input.sortOrder;

    const { data, error } = await this.supabase
      .from("languages")
      .update(payload)
      .eq("code", code)
      .select("*")
      .single();

    if (error) throw new Error(error.message);
    const entity = LanguageMapper.toDomain(data);
    await this.logActivity("updated", entity.code, { name: entity.name });
    return entity;
  }

  async deleteLanguage(code: string): Promise<void> {
    const existing = await this.getLanguageByCode(code);
    if (existing?.isRequired) {
      throw new Error(`Cannot delete required system language (${code.toUpperCase()}).`);
    }

    const { error } = await this.supabase.from("languages").delete().eq("code", code);
    if (error) throw new Error(error.message);
    await this.logActivity("deleted", code);
  }
}
