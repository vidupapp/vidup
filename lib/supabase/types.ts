export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          email: string;
          credits_balance: number;
          free_credits_used: number;
          signup_date: string;
          monthly_reset_date: string;
          referral_code: string;
          referred_by: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          credits_balance?: number;
          free_credits_used?: number;
          signup_date?: string;
          monthly_reset_date?: string;
          referral_code: string;
          referred_by?: string | null;
          created_at?: string;
        };
        Update: {
          credits_balance?: number;
          free_credits_used?: number;
          monthly_reset_date?: string;
        };
      };
      packs: {
        Row: {
          pack_id: string;
          user_id: string;
          topic: string;
          style: "Educational" | "Story" | "Opinion" | "Entertainment";
          language: string;
          links: string[];
          titles: Json[];
          hook: Json;
          thumbnails: Json[];
          created_at: string;
          credit_used: number;
          status: "Generated" | "Video Live" | "Results In";
        };
        Insert: {
          pack_id?: string;
          user_id: string;
          topic: string;
          style: "Educational" | "Story" | "Opinion" | "Entertainment";
          language: string;
          links: string[];
          titles: Json[];
          hook: Json;
          thumbnails: Json[];
          credit_used?: number;
          status?: "Generated" | "Video Live" | "Results In";
        };
        Update: {
          status?: "Generated" | "Video Live" | "Results In";
        };
      };
      results: {
        Row: {
          result_id: string;
          pack_id: string;
          user_id: string;
          youtube_link: string;
          views_30d: number | null;
          ctr: number | null;
          avg_view_duration: number | null;
          like_count: number | null;
          comment_count: number | null;
          submitted_at: string;
        };
        Insert: {
          result_id?: string;
          pack_id: string;
          user_id: string;
          youtube_link: string;
          views_30d?: number | null;
          ctr?: number | null;
          avg_view_duration?: number | null;
          like_count?: number | null;
          comment_count?: number | null;
          submitted_at?: string;
        };
        Update: {
          views_30d?: number | null;
          ctr?: number | null;
          avg_view_duration?: number | null;
          like_count?: number | null;
          comment_count?: number | null;
        };
      };
      learning_data: {
        Row: {
          id: string;
          niche: string;
          style: string;
          language: string;
          title_type: string;
          avg_ctr: number | null;
          avg_avd: number | null;
          sample_size: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          niche: string;
          style: string;
          language: string;
          title_type: string;
          avg_ctr?: number | null;
          avg_avd?: number | null;
          sample_size?: number;
          updated_at?: string;
        };
        Update: {
          avg_ctr?: number | null;
          avg_avd?: number | null;
          sample_size?: number;
          updated_at?: string;
        };
      };
      prompts: {
        Row: {
          prompt_id: string;
          language: string;
          call_type: "analysis" | "generation";
          prompt_text: string;
          version: number;
          updated_at: string;
        };
        Insert: {
          prompt_id?: string;
          language: string;
          call_type: "analysis" | "generation";
          prompt_text: string;
          version?: number;
          updated_at?: string;
        };
        Update: {
          prompt_text?: string;
          version?: number;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          transaction_id: string;
          user_id: string;
          pack_type: "Starter" | "Creator" | "Pro";
          amount: number;
          credits_added: number;
          payment_gateway: string;
          status: "pending" | "success" | "failed";
          created_at: string;
        };
        Insert: {
          transaction_id?: string;
          user_id: string;
          pack_type: "Starter" | "Creator" | "Pro";
          amount: number;
          credits_added: number;
          payment_gateway: string;
          status?: "pending" | "success" | "failed";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "success" | "failed";
        };
      };
    };
  };
};
