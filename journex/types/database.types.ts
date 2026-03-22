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
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          has_password: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          has_password?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          has_password?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          content_text: string
          tags: string[]
          word_count: number
          is_complete: boolean
          last_edited_section: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          content?: string
          content_text?: string
          tags?: string[]
          word_count?: number
          is_complete?: boolean
          last_edited_section?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          content_text?: string
          tags?: string[]
          word_count?: number
          is_complete?: boolean
          last_edited_section?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'journal_entries_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type EntryRow = Database['public']['Tables']['journal_entries']['Row']
export type EntryInsert = Database['public']['Tables']['journal_entries']['Insert']
export type EntryUpdate = Database['public']['Tables']['journal_entries']['Update']
