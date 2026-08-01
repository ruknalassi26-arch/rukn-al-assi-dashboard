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
          reference_number: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          country: string | null;
          product_id: string | null;
          product_name: string | null;
          quantity: number | null;
          unit: string | null;
          requirements: string | null;
          attachment_url: string | null;
          status: "pending" | "reviewed" | "quoted" | "closed";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["rfq_requests"]["Row"], "id" | "reference_number" | "created_at" | "updated_at"> & {
          id?: string;
          reference_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rfq_requests"]["Insert"]>;
        Relationships: [];
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
      homepage_hero: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          subtitle_en: string | null;
          subtitle_ar: string | null;
          primary_button_text_en: string | null;
          primary_button_text_ar: string | null;
          primary_button_url: string | null;
          secondary_button_text_en: string | null;
          secondary_button_text_ar: string | null;
          secondary_button_url: string | null;
          background_image: string | null;
          overlay_opacity: number;
          status: "active" | "draft";
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["homepage_hero"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_hero"]["Insert"]>;
        Relationships: [];
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
      company_statistics: {
        Row: {
          id: string;
          title_en: string;
          title_ar: string;
          value: string;
          icon: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_statistics"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_statistics"]["Insert"]>;
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          name_en: string;
          name_ar: string;
          logo_url: string | null;
          website_url: string | null;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["clients"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Insert"]>;
        Relationships: [];
      };
      homepage_contact_cta: {
        Row: {
          id: string;
          heading_en: string;
          heading_ar: string;
          description_en: string | null;
          description_ar: string | null;
          button_text_en: string | null;
          button_text_ar: string | null;
          button_url: string | null;
          background_image: string | null;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["homepage_contact_cta"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_contact_cta"]["Insert"]>;
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
      company_branches: {
        Row: {
          id: string;
          name_en: string;
          name_ar: string;
          name_ku?: string | null;
          address_en: string | null;
          address_ar: string | null;
          address_ku?: string | null;
          city_en: string | null;
          city_ar: string | null;
          city_ku?: string | null;
          email: string | null;
          phone: string | null;
          google_maps_url: string | null;
          latitude?: number | null;
          longitude?: number | null;
          working_hours_en: string | null;
          working_hours_ar: string | null;
          working_hours_ku?: string | null;
          is_headquarters: boolean;
          sort_order: number;
          status: "active" | "draft";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["company_branches"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["company_branches"]["Insert"]>;
        Relationships: [];
      };
      seo_settings: {
        Row: {
          id: string;
          page_key: "home" | "about" | "products" | "categories" | "services" | "projects" | "certificates" | "contact";
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_status: "active" | "draft" | "archived";
      service_status: "active" | "draft";
      rfq_status: "pending" | "reviewed" | "quoted" | "closed";
      contact_status: "new" | "read" | "replied";
      activity_action: "created" | "updated" | "deleted" | "login" | "logout" | "settings_updated" | "seo_updated";
      activity_entity_type: "product" | "service" | "project" | "rfq" | "contact" | "homepage" | "settings" | "seo" | "auth";
      certificate_status: "active" | "draft";
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
