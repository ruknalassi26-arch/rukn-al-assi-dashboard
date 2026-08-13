// ==============================================================================
// core/types/database.types.ts
// Supabase Database type stub — replace with actual generated types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/core/types/database.types.ts
// ==============================================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Type stub for the Supabase database schema.
 * Replace this with the output of `supabase gen types typescript`.
 *
 * Tables should match your SQL schema.
 */
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_ar: string;
          short_description_en: string | null;
          short_description_ar: string | null;
          description_en: string | null;
          description_ar: string | null;
          seo_title_en: string | null;
          seo_title_ar: string | null;
          seo_description_en: string | null;
          seo_description_ar: string | null;
          category_id: string | null;
          images: string[];
          thumbnail: string | null;
          datasheet_url: string | null;
          seo_image: string | null;
          status: "active" | "draft" | "archived";
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_en: string;
          name_ar: string;
          short_description_en?: string | null;
          short_description_ar?: string | null;
          description_en?: string | null;
          description_ar?: string | null;
          seo_title_en?: string | null;
          seo_title_ar?: string | null;
          seo_description_en?: string | null;
          seo_description_ar?: string | null;
          category_id?: string | null;
          images?: string[];
          thumbnail?: string | null;
          datasheet_url?: string | null;
          seo_image?: string | null;
          status?: "active" | "draft" | "archived";
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_categories: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_ar: string;
          description_en: string | null;
          description_ar: string | null;
          name_ku?: string | null;
          description_ku?: string | null;
          icon: string | null;
          image?: string | null;
          seo_title_en?: string | null;
          seo_title_ar?: string | null;
          seo_title_ku?: string | null;
          seo_description_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_ku?: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["product_categories"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["product_categories"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ar: string;
          title_ku?: string | null;
          short_description_en?: string | null;
          short_description_ar?: string | null;
          short_description_ku?: string | null;
          description_en: string | null;
          description_ar: string | null;
          description_ku?: string | null;
          icon: string | null;
          image: string | null;
          seo_title_en?: string | null;
          seo_title_ar?: string | null;
          seo_title_ku?: string | null;
          seo_description_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_ku?: string | null;
          seo_image?: string | null;
          is_featured: boolean;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ar: string;
          title_ku?: string | null;
          short_description_en?: string | null;
          short_description_ar?: string | null;
          short_description_ku?: string | null;
          description_en: string | null;
          description_ar: string | null;
          description_ku?: string | null;
          client: string | null;
          location: string | null;
          year: number | null;
          completion_date?: string | null;
          category_id?: string | null;
          cover_image?: string | null;
          images: string[];
          status: "active" | "draft" | "completed" | "ongoing" | "upcoming";
          is_featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      rfq_requests: {
        Row: {
          id: string;
          full_name: string;
          company_name: string | null;
          phone: string;
          address: string;
          notes: string | null;
          status: "new" | "assigned" | "quoted" | "won" | "lost" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          company_name?: string | null;
          phone: string;
          address: string;
          notes?: string | null;
          status?: "new" | "assigned" | "quoted" | "won" | "lost" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rfq_requests"]["Insert"]>;
        Relationships: [];
      };
      rfq_items: {
        Row: {
          id: string;
          rfq_id: string;
          item_type: "product" | "service";
          product_id: string | null;
          service_id: string | null;
          quantity: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          item_type: "product" | "service";
          product_id?: string | null;
          service_id?: string | null;
          quantity?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rfq_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "rfq_items_rfq_id_fkey";
            columns: ["rfq_id"];
            isOneToOne: false;
            referencedRelation: "rfq_requests";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rfq_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rfq_items_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      rfq_attachments: {
        Row: {
          id: string;
          rfq_id: string;
          file_url: string;
          file_name: string;
          mime_type: string | null;
          file_size_kb: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          file_url: string;
          file_name: string;
          mime_type?: string | null;
          file_size_kb?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rfq_attachments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "rfq_attachments_rfq_id_fkey";
            columns: ["rfq_id"];
            isOneToOne: false;
            referencedRelation: "rfq_requests";
            referencedColumns: ["id"];
          }
        ];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: "new" | "read" | "replied";
          attachment_url?: string | null;
          notes?: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["contact_submissions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_submissions"]["Insert"]>;
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          action: "created" | "updated" | "deleted" | "login" | "logout" | "settings_updated" | "seo_updated";
          entity_type: "product" | "service" | "project" | "rfq" | "contact" | "homepage" | "settings" | "seo" | "auth";
          entity_id: string | null;
          entity_title: string | null;
          user_id: string | null;
          user_email: string | null;
          ip_address?: string | null;
          old_value?: unknown;
          new_value?: unknown;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["activity_logs"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          type: "rfq_new" | "contact_new" | "system" | "email_failure" | "admin_login";
          title: string;
          message: string;
          link: string | null;
          is_read: boolean;
          user_id: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          status: "active" | "draft";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: "active" | "draft";
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["certifications"]["Insert"]>;
        Relationships: [];
      };
      company_profile: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_profile"]["Insert"]>;
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          title_ku?: string | null;
          description_en: string | null;
          description_ar: string | null;
          description_ku?: string | null;
          image: string | null;
          issue_date: string | null;
          expiry_date: string | null;
          organization: string | null;
          organization_ar?: string | null;
          organization_ku?: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["certificates"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["certificates"]["Insert"]>;
        Relationships: [];
      };
      company_info: {
        Row: {
          id: string;
          company_name_en: string;
          company_name_ar: string;
          short_description_en: string | null;
          short_description_ar: string | null;
          full_description_en: string | null;
          full_description_ar: string | null;
          established_year: number | null;
          headquarters: string | null;
          website: string | null;
          phone: string | null;
          email: string | null;
          status: "active" | "draft";
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_info"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_info"]["Insert"]>;
        Relationships: [];
      };
      company_mission: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          content_en: string | null;
          content_ar: string | null;
          icon: string | null;
          status: "active" | "draft";
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_mission"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_mission"]["Insert"]>;
        Relationships: [];
      };
      company_vision: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          content_en: string | null;
          content_ar: string | null;
          icon: string | null;
          status: "active" | "draft";
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_vision"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_vision"]["Insert"]>;
        Relationships: [];
      };
      core_values: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          icon: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["core_values"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["core_values"]["Insert"]>;
        Relationships: [];
      };
      company_timeline: {
        Row: {
          id: string;
          year: string;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          image: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_timeline"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_timeline"]["Insert"]>;
        Relationships: [];
      };
      management_team: {
        Row: {
          id: string;
          photo: string | null;
          full_name_en: string;
          full_name_ar: string;
          full_name_ku?: string | null;
          position_en: string | null;
          position_ar: string | null;
          position_ku?: string | null;
          department_en?: string | null;
          department_ar?: string | null;
          department_ku?: string | null;
          biography_en: string | null;
          biography_ar: string | null;
          biography_ku?: string | null;
          linkedin: string | null;
          email: string | null;
          phone: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["management_team"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["management_team"]["Insert"]>;
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          is_visible: boolean;
          sort_order: number;
          settings: Json;
          created_by: string | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          is_visible?: boolean;
          sort_order?: number;
          settings?: Json;
          created_by?: string | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_sections"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "homepage_sections_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homepage_sections_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      homepage_section_translations: {
        Row: {
          section_id: string;
          language_code: string;
          title: string | null;
          subtitle: string | null;
          body: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_url: string | null;
        };
        Insert: {
          section_id: string;
          language_code: string;
          title?: string | null;
          subtitle?: string | null;
          body?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_section_translations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "homepage_section_translations_language_code_fkey";
            columns: ["language_code"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "homepage_section_translations_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "homepage_sections";
            referencedColumns: ["id"];
          }
        ];
      };
      homepage_hero_slides: {
        Row: {
          id: string;
          sort_order: number;
          is_active: boolean;
          overlay_opacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sort_order?: number;
          is_active?: boolean;
          overlay_opacity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_hero_slides"]["Insert"]>;
        Relationships: [];
      };
      homepage_hero_slide_translations: {
        Row: {
          slide_id: string;
          language_code: string;
          title: string | null;
          subtitle: string | null;
          body: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_url: string | null;
        };
        Insert: {
          slide_id: string;
          language_code: string;
          title?: string | null;
          subtitle?: string | null;
          body?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_hero_slide_translations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "homepage_hero_slide_translations_language_code_fkey";
            columns: ["language_code"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "homepage_hero_slide_translations_slide_id_fkey";
            columns: ["slide_id"];
            isOneToOne: false;
            referencedRelation: "homepage_hero_slides";
            referencedColumns: ["id"];
          }
        ];
      };
      homepage_about: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          description_en: string | null;
          description_ar: string | null;
          image_url: string | null;
          button_text_en: string | null;
          button_text_ar: string | null;
          button_url: string | null;
          highlights_en: string[] | null;
          highlights_ar: string[] | null;
          status: "active" | "draft";
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["homepage_about"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_about"]["Insert"]>;
        Relationships: [];
      };
      stats: {
        Row: {
          id: string;
          icon: string | null;
          number_value: string | null;
          sort_order: number;
          status: "published" | "draft" | "archived";
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stats"]["Row"], "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["stats"]["Insert"]>;
        Relationships: [];
      };
      stat_translations: {
        Row: {
          stat_id: string;
          language_code: string;
          label: string | null;
        };
        Insert: Database["public"]["Tables"]["stat_translations"]["Row"];
        Update: Partial<Database["public"]["Tables"]["stat_translations"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name: string;
          name_en?: string | null;
          name_ar?: string | null;
          logo_url: string | null;
          website_url: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name?: string;
          name_en?: string | null;
          name_ar?: string | null;
          logo_url?: string | null;
          website_url?: string | null;
          sort_order?: number;
          status?: "active" | "draft";
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };

      website_settings: {
        Row: {
          id: string;
          company_name_en: string;
          company_name_ar: string;
          company_name_ku?: string | null;
          tagline_en?: string | null;
          tagline_ar?: string | null;
          tagline_ku?: string | null;
          logo_url?: string | null;
          logo_dark_url?: string | null;
          favicon_url?: string | null;
          email: string | null;
          phone: string | null;
          phone_secondary?: string | null;
          address_en: string | null;
          address_ar: string | null;
          address_ku?: string | null;
          google_maps_url: string | null;
          latitude?: number | null;
          longitude?: number | null;
          working_hours_en: string | null;
          working_hours_ar: string | null;
          working_hours_ku?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          youtube_url?: string | null;
          whatsapp_number?: string | null;
          seo_title_en?: string | null;
          seo_title_ar?: string | null;
          seo_title_ku?: string | null;
          seo_description_en?: string | null;
          seo_description_ar?: string | null;
          seo_description_ku?: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["website_settings"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["website_settings"]["Insert"]>;
        Relationships: [];
      };
      branches: {
        Row: {
          id: string;
          map_lat: number | null;
          map_lng: number | null;
          phone: string | null;
          email: string | null;
          whatsapp_number: string | null;
          sort_order: number;
          status: "draft" | "published" | "archived";
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          map_lat?: number | null;
          map_lng?: number | null;
          phone?: string | null;
          email?: string | null;
          whatsapp_number?: string | null;
          sort_order?: number;
          status?: "draft" | "published" | "archived";
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["branches"]["Insert"]>;
        Relationships: [];
      };
      branch_translations: {
        Row: {
          branch_id: string;
          language_code: string;
          name: string;
          address: string | null;
        };
        Insert: {
          branch_id: string;
          language_code: string;
          name: string;
          address?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["branch_translations"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "branch_translations_branch_id_fkey";
            columns: ["branch_id"];
            isOneToOne: false;
            referencedRelation: "branches";
            referencedColumns: ["id"];
          }
        ];
      };
      seo_settings: {
        Row: {
          id: string;
          page_key: "home" | "about" | "products" | "categories" | "services" | "projects" | "certificates" | "contact" | "careers";
          meta_title_en: string | null;
          meta_title_ar: string | null;
          meta_title_ku?: string | null;
          meta_description_en: string | null;
          meta_description_ar: string | null;
          meta_description_ku?: string | null;
          keywords_en: string | null;
          keywords_ar: string | null;
          keywords_ku?: string | null;
          og_image_url: string | null;
          is_indexed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["seo_settings"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["seo_settings"]["Insert"]>;
        Relationships: [];
      };
      job_postings: {
        Row: {
          id: string;
          department: string | null;
          employment_type: "full_time" | "part_time" | "contract" | "internship";
          location: string | null;
          closes_at: string | null;
          sort_order: number;
          status: "draft" | "published" | "archived";
          deleted_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["job_postings"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_postings"]["Insert"]>;
        Relationships: [];
      };
      job_posting_translations: {
        Row: {
          job_posting_id: string;
          language_code: string;
          slug: string;
          title: string;
          description: string | null;
          requirements: string | null;
        };
        Insert: Database["public"]["Tables"]["job_posting_translations"]["Row"];
        Update: Partial<Database["public"]["Tables"]["job_posting_translations"]["Insert"]>;
        Relationships: [];
      };
      career_applications: {
        Row: {
          id: string;
          job_posting_id: string | null;
          full_name: string;
          email: string;
          phone: string;
          cover_message: string | null;
          cv_file_url: string;
          cv_file_name: string;
          status: "new" | "reviewed" | "shortlisted" | "rejected" | "hired";
          created_at: string;
        };
        Insert: {
          id?: string;
          job_posting_id?: string | null;
          full_name: string;
          email: string;
          phone: string;
          cover_message?: string | null;
          cv_file_url: string;
          cv_file_name: string;
          status?: "new" | "reviewed" | "shortlisted" | "rejected" | "hired";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["career_applications"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "career_applications_job_posting_id_fkey";
            columns: ["job_posting_id"];
            isOneToOne: false;
            referencedRelation: "job_postings";
            referencedColumns: ["id"];
          }
        ];
      };
      admin_profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string | null;
          is_active: boolean;
          last_login_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_profiles"]["Insert"]>;
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          photo_url: string | null;
          sort_order: number;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          photo_url?: string | null;
          sort_order?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
        Relationships: [];
      };
      team_member_translations: {
        Row: {
          id: string;
          team_member_id: string;
          language_code: string;
          name: string | null;
          position: string | null;
          bio: string | null;
        };
        Insert: {
          id?: string;
          team_member_id: string;
          language_code: string;
          name?: string | null;
          position?: string | null;
          bio?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["team_member_translations"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      roles: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_system?: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_system?: boolean | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["roles"]["Insert"]>;
        Relationships: [];
      };
      permissions: {
        Row: {
          id: string;
          code?: string | null;
          name?: string | null;
          module?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Insert: {
          id?: string;
          code?: string | null;
          name?: string | null;
          module?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["permissions"]["Insert"]>;
        Relationships: [];
      };
      role_permissions: {
        Row: {
          role_id: string;
          permission_id: string;
        };
        Insert: {
          role_id: string;
          permission_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["role_permissions"]["Insert"]>;
        Relationships: [];
      };
      admin_user_roles: {
        Row: {
          admin_user_id: string;
          role_id: string;
        };
        Insert: {
          admin_user_id: string;
          role_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_user_roles"]["Insert"]>;
        Relationships: [];
      };
      activity_log: {
        Row: {
          id: string;
          admin_user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          details: Record<string, unknown> | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Record<string, unknown> | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["activity_log"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "activity_log_admin_user_id_fkey";
            columns: ["admin_user_id"];
            isOneToOne: false;
            referencedRelation: "admin_profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      settings: {
        Row: {
          key: string;
          value: string | null;
          updated_at?: string | null;
        };
        Insert: {
          key: string;
          value: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["settings"]["Insert"]>;
        Relationships: [];
      };
      seo_meta: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string | null;
          language_code: string;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          canonical_url: string | null;
          schema_json: Record<string, unknown> | unknown[] | null;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id?: string | null;
          language_code: string;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          canonical_url?: string | null;
          schema_json?: Record<string, unknown> | unknown[] | null;
        };
        Update: Partial<Database["public"]["Tables"]["seo_meta"]["Insert"]>;
        Relationships: [];
      };
      languages: {
        Row: {
          code: string;
          name: string;
          native_name: string;
          is_rtl: boolean;
          is_required: boolean;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Insert: {
          code: string;
          name: string;
          native_name?: string;
          is_rtl?: boolean;
          is_required?: boolean;
          is_active?: boolean | null;
          sort_order?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["languages"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: "active" | "draft" | "archived";
      service_status: "active" | "draft";
      rfq_status: "pending" | "reviewed" | "quoted" | "closed";
      contact_status: "new" | "read" | "replied";
      activity_action: "created" | "updated" | "deleted" | "login" | "logout" | "settings_updated" | "seo_updated";
      activity_entity_type: "product" | "service" | "project" | "rfq" | "contact" | "homepage" | "settings" | "seo" | "auth" | "career";
      certificate_status: "active" | "draft";
      employment_type: "full_time" | "part_time" | "contract" | "internship";
      job_posting_status: "draft" | "published" | "archived";
      career_application_status: "new" | "reviewed" | "shortlisted" | "rejected" | "hired";
    };
  };
}

/** Convenience type helpers */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
