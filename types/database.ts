export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      signal_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          max_selections: number
          display_order: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          max_selections: number
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          max_selections?: number
          display_order?: number
          created_at?: string
        }
      }
      signals: {
        Row: {
          id: string
          category_id: string
          label: string
          description: string | null
          expiration_days: number | null
          display_order: number
          created_at: string
        }
        Insert: {
          id: string
          category_id: string
          label: string
          description?: string | null
          expiration_days?: number | null
          display_order: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          label?: string
          description?: string | null
          expiration_days?: number | null
          display_order?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_signals: {
        Row: {
          id: string
          user_id: string
          signal_id: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          signal_id: string
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          signal_id?: string
          created_at?: string
          expires_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
