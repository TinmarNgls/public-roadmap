
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
      ideas: {
        Row: {
          id: string
          created_by: string
          created_at: string
          status: 'released' | 'ongoing' | 'consideration' | 'backlog' | 'submitted'
          title: string
          description: string
        }
        Insert: {
          id?: string
          created_by: string
          created_at?: string
          status: 'released' | 'ongoing' | 'consideration' | 'backlog' | 'submitted'
          title: string
          description: string
        }
        Update: {
          id?: string
          created_by?: string
          created_at?: string
          status?: 'released' | 'ongoing' | 'consideration' | 'backlog' | 'submitted'
          title?: string
          description?: string
        }
      }
      comments: {
        Row: {
          id: string
          idea_id: string
          created_by: string
          created_at: string
          comment: string
        }
        Insert: {
          id?: string
          idea_id: string
          created_by: string
          created_at?: string
          comment: string
        }
        Update: {
          id?: string
          idea_id?: string
          created_by?: string
          created_at?: string
          comment?: string
        }
      }
      upvotes: {
        Row: {
          id: string
          idea_id: string
          created_at: string
          created_by?: string | null
          email?: string | null
        }
        Insert: {
          id?: string
          idea_id: string
          created_at?: string
          created_by?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          idea_id?: string
          created_at?: string
          created_by?: string | null
          email?: string | null
        }
      }
      translations: {
        Row: {
          id: string
          source_text: string
          source_language: string
          target_language: string
          translated_text: string
          created_at: string
        }
        Insert: {
          id?: string
          source_text: string
          source_language: string
          target_language: string
          translated_text: string
          created_at?: string
        }
        Update: {
          id?: string
          source_text?: string
          source_language?: string
          target_language?: string
          translated_text?: string
          created_at?: string
        }
      }
    }
  }
}
