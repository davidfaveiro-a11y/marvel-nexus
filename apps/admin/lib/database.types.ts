export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      invitations: {
        Row: {
          id: string;
          code: string;
          email: string | null;
          expires_at: string | null;
          max_uses: number;
          used_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          code: string;
          email?: string | null;
          expires_at?: string | null;
          max_uses?: number;
          is_active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["invitations"]["Row"]>;
        Relationships: [];
      };
      storage_assets: {
        Row: {
          id: string;
          bucket: string;
          path: string;
          alt_text: string;
          credit: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["storage_assets"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["storage_assets"]["Row"]>;
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          cover_asset_id: string | null;
          banner_asset_id: string | null;
          primary_color: string;
          starts_at: string | null;
          ends_at: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
        Relationships: [];
      };
      characters: {
        Row: {
          id: string;
          name: string;
          alias: string | null;
          description: string | null;
          affiliation: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["characters"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["characters"]["Row"]>;
        Relationships: [];
      };
      rarities: {
        Row: {
          id: string;
          name: string;
          rank: number;
          color: string;
          border_style: string;
          visual_effect: string;
          reveal_animation: string;
          default_xp: number;
          duplicate_value: number;
          default_weight: number;
          sound_asset_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["rarities"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["rarities"]["Row"]>;
        Relationships: [];
      };
      cards: {
        Row: {
          id: string;
          public_number: number;
          character_id: string;
          collection_id: string;
          rarity_id: string;
          edition_name: string;
          description: string | null;
          xp_value: number;
          duplicate_value: number;
          draw_weight: number;
          artwork_asset_id: string | null;
          thumbnail_asset_id: string | null;
          released_at: string | null;
          ends_at: string | null;
          is_active: boolean;
          is_event_card: boolean;
          frame_style: string;
          animation_profile: string;
          display_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["cards"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["cards"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          level: number;
          total_xp: number;
          current_xp: number;
          next_level_xp: number;
          fragments: number;
          status: string;
          next_pack_available_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Row"]>;
        Relationships: [];
      };
      game_settings: {
        Row: {
          id: boolean;
          pack_cooldown: string;
          cards_per_pack: number;
          duplicate_conversion: string;
          draw_mode: string;
          pity_enabled: boolean;
          maintenance_enabled: boolean;
          announcement: string | null;
          minimum_app_version: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["game_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["game_settings"]["Row"]>;
        Relationships: [];
      };
      draw_configurations: {
        Row: {
          id: string;
          name: string;
          draw_mode: string;
          rarity_weights: Json;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["draw_configurations"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["draw_configurations"]["Row"]>;
        Relationships: [];
      };
      pack_openings: {
        Row: {
          id: string;
          player_id: string;
          opened_at: string;
          xp_gained: number;
          fragments_gained: number;
        };
        Insert: Partial<Database["public"]["Tables"]["pack_openings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["pack_openings"]["Row"]>;
        Relationships: [];
      };
      pack_opening_items: {
        Row: {
          id: string;
          opening_id: string;
          card_id: string;
          rarity_id: string;
          is_duplicate: boolean;
          xp_gained: number;
          fragments_gained: number;
        };
        Insert: Partial<Database["public"]["Tables"]["pack_opening_items"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["pack_opening_items"]["Row"]>;
        Relationships: [];
      };
      player_cards: {
        Row: {
          player_id: string;
          card_id: string;
          copies: number;
          is_favorite: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["player_cards"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["player_cards"]["Row"]>;
        Relationships: [];
      };
      xp_transactions: {
        Row: {
          id: string;
          player_id: string;
          source: string;
          amount: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["xp_transactions"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["xp_transactions"]["Row"]>;
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_table: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_audit_logs"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["admin_audit_logs"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
