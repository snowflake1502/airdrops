import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcakqykdtxlythsutgpx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYWtxeWtkdHhseXRoc3V0Z3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNTMyNTUsImV4cCI6MjA3NTgyOTI1NX0.Nbb4oQKKQaTTe46vjTHPNTxDnqxZL4X5MswbyZD2xjY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (to be extended as we build the schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      airdrop_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          start_date: string
          end_date: string
          status: 'active' | 'completed' | 'paused'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string
          start_date: string
          end_date: string
          status?: 'active' | 'completed' | 'paused'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string
          status?: 'active' | 'completed' | 'paused'
          created_at?: string
          updated_at?: string
        }
      }
      protocols: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          ecosystem: 'solana' | 'ethereum' | 'other'
          website_url?: string
          twitter_url?: string
          discord_url?: string
          airdrop_potential: 'high' | 'medium' | 'low' | 'confirmed'
          status: 'active' | 'inactive' | 'upcoming'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          category: string
          ecosystem?: 'solana' | 'ethereum' | 'other'
          website_url?: string
          twitter_url?: string
          discord_url?: string
          airdrop_potential?: 'high' | 'medium' | 'low' | 'confirmed'
          status?: 'active' | 'inactive' | 'upcoming'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          ecosystem?: 'solana' | 'ethereum' | 'other'
          website_url?: string
          twitter_url?: string
          discord_url?: string
          airdrop_potential?: 'high' | 'medium' | 'low' | 'confirmed'
          status?: 'active' | 'inactive' | 'upcoming'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

