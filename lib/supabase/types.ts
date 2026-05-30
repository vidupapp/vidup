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
          credits_balance: number;        // legacy — kept for migration safety
          free_credits_used: number;      // legacy
          free_credits: number;           // new: resets monthly
          purchased_credits: number;      // new: never expires
          referral_credits: number;       // new: never expires
          free_credits_reset_date: string | null;
          onboarding_dismissed: boolean;
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
          free_credits?: number;
          purchased_credits?: number;
          referral_credits?: number;
          free_credits_reset_date?: string | null;
          signup_date?: string;
          monthly_reset_date?: string;
          referral_code: string;
          referred_by?: string | null;
          created_at?: string;
        };
        Update: {
          credits_balance?: number;
          free_credits_used?: number;
          free_credits?: number;
          purchased_credits?: number;
          referral_credits?: number;
          free_credits_reset_date?: string | null;
          onboarding_dismissed?: boolean;
          monthly_reset_date?: string;
          referred_by?: string | null;
        };
      };
      channels: {
        Row: {
          channel_id: string;
          user_id: string;
          channel_url: string;
          youtube_channel_id: string;
          channel_name: string;
          subscriber_count: number;
          total_videos: number;
          avg_views: number;
          recent_video_titles: Json;
          upload_frequency: string;
          content_category: string | null;
          target_audience: string[];
          topic_categories: string[] | null;
          primary_language: string | null;
          avatar_url: string | null;
          last_fetched_at: string;
          created_at: string;
        };
        Insert: {
          channel_id?: string;
          user_id: string;
          channel_url: string;
          youtube_channel_id: string;
          channel_name: string;
          subscriber_count?: number;
          total_videos?: number;
          avg_views?: number;
          recent_video_titles?: Json;
          upload_frequency?: string;
          content_category?: string | null;
          target_audience: string[];
          topic_categories?: string[] | null;
          primary_language?: string | null;
          avatar_url?: string | null;
          last_fetched_at?: string;
          created_at?: string;
        };
        Update: {
          subscriber_count?: number;
          total_videos?: number;
          avg_views?: number;
          recent_video_titles?: Json;
          upload_frequency?: string;
          content_category?: string | null;
          topic_categories?: string[] | null;
          target_audience?: string[];
          avatar_url?: string | null;
          last_fetched_at?: string;
        };
      };
      packs: {
        Row: {
          pack_id: string;
          user_id: string;
          channel_id: string | null;
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
          video_url: string | null;
          video_submitted_at: string | null;
          results_fetched_at: string | null;
        };
        Insert: {
          pack_id?: string;
          user_id: string;
          channel_id?: string | null;
          topic: string;
          style: "Educational" | "Story" | "Opinion" | "Entertainment";
          language: string;
          links: string[];
          titles: Json[];
          hook: Json;
          thumbnails: Json[];
          credit_used?: number;
          status?: "Generated" | "Video Live" | "Results In";
          video_url?: string | null;
          video_submitted_at?: string | null;
          results_fetched_at?: string | null;
        };
        Update: {
          status?: "Generated" | "Video Live" | "Results In";
          video_url?: string | null;
          video_submitted_at?: string | null;
          results_fetched_at?: string | null;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string;
          type: "purchase" | "free_reset" | "referral" | "bonus" | "generation" | "expired";
          credits: number;
          amount_paid: number;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "purchase" | "free_reset" | "referral" | "bonus" | "generation" | "expired";
          credits: number;
          amount_paid?: number;
          description?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
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
