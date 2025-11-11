import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These values should be set in your environment variables on Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema helper types for Supabase
export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          property_uid: string;
          title: string;
          address: string;
          area: number;
          description: string;
          status: string;
          price: number | null;
          owner_id: string;
          owner_name: string;
          registered_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          property_id: string;
          seller_id: string;
          seller_name: string;
          buyer_id: string;
          buyer_name: string;
          amount: number;
          status: string;
          initiated_at: string;
          completed_at: string | null;
          inspector_id: string | null;
          inspector_name: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      blocks: {
        Row: {
          id: string;
          block_index: number;
          timestamp: string;
          transaction_id: string;
          property_id: string;
          property_uid: string;
          from_owner: string;
          to_owner: string;
          amount: number;
          previous_hash: string;
          current_hash: string;
          nonce: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blocks']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          role: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
};
