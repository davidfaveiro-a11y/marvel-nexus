export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          primary_color: string;
          display_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["collections"]["Row"]>;
      };
      cards: {
        Row: {
          id: string;
          public_number: number;
          edition_name: string;
          description: string | null;
          xp_value: number;
          collection_id: string;
          display_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["cards"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["cards"]["Row"]>;
      };
      profiles: {
        Row: {
          id: string;
          username: string;
          level: number;
          total_xp: number;
          hide_leaderboard_stats: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      player_cards: {
        Row: {
          player_id: string;
          card_id: string;
          copies: number;
        };
        Insert: Partial<Database["public"]["Tables"]["player_cards"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["player_cards"]["Row"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      open_free_pack: {
        Args: { idempotency_key: string };
        Returns: Record<string, unknown>;
      };
      complete_invited_profile: {
        Args: { invitation_code: string; desired_username: string };
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
