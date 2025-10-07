export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      blockchain_batches: {
        Row: {
          business_id: string
          id: string
          merkle_root: string | null
          onchain_tx_hash: string | null
          recorded_at: string | null
          total_amount: number
          transaction_count: number
          transaction_ids: string[]
        }
        Insert: {
          business_id: string
          id?: string
          merkle_root?: string | null
          onchain_tx_hash?: string | null
          recorded_at?: string | null
          total_amount: number
          transaction_count: number
          transaction_ids: string[]
        }
        Update: {
          business_id?: string
          id?: string
          merkle_root?: string | null
          onchain_tx_hash?: string | null
          recorded_at?: string | null
          total_amount?: number
          transaction_count?: number
          transaction_ids?: string[]
        }
        Relationships: [
          {
            foreignKeyName: 'blockchain_batches_business_id_fkey'
            columns: ['business_id']
            isOneToOne: false
            referencedRelation: 'businesses'
            referencedColumns: ['id']
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string | null
          owner_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
          owner_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string | null
          owner_id?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          business_id: string
          created_at: string
          id: string
          nft_id: string
          points: number
          user_id: string
          wallet_address: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          nft_id: string
          points: number
          user_id: string
          wallet_address: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          nft_id?: string
          points?: number
          user_id?: string
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memberships_business_id_fkey'
            columns: ['business_id']
            isOneToOne: false
            referencedRelation: 'businesses'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          business_id: string
          created_at: string
          id: string
          name: string
          price: number
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          name: string
          price: number
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: 'products_business_id_fkey'
            columns: ['business_id']
            isOneToOne: false
            referencedRelation: 'businesses'
            referencedColumns: ['id']
          },
        ]
      }
      reward_programs: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          reward_description: string
          threshold: number
          type: Database['public']['Enums']['reward_program_type']
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          reward_description: string
          threshold?: number
          type?: Database['public']['Enums']['reward_program_type']
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          reward_description?: string
          threshold?: number
          type?: Database['public']['Enums']['reward_program_type']
        }
        Relationships: [
          {
            foreignKeyName: 'reward_programs_business_id_fkey'
            columns: ['business_id']
            isOneToOne: false
            referencedRelation: 'businesses'
            referencedColumns: ['id']
          },
        ]
      }
      reward_redemptions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          membership_id: string
          nft_id: string | null
          nft_redeemed: boolean | null
          nft_redeemed_at: string | null
          points_spent: number
          redeemed_by: string | null
          rejected_at: string | null
          rejection_reason: string | null
          requested_at: string | null
          reward_program_id: string
          status: string | null
          token_id: string | null
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          membership_id: string
          nft_id?: string | null
          nft_redeemed?: boolean | null
          nft_redeemed_at?: string | null
          points_spent: number
          redeemed_by?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          reward_program_id: string
          status?: string | null
          token_id?: string | null
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          membership_id?: string
          nft_id?: string | null
          nft_redeemed?: boolean | null
          nft_redeemed_at?: string | null
          points_spent?: number
          redeemed_by?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          requested_at?: string | null
          reward_program_id?: string
          status?: string | null
          token_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reward_redemptions_membership_id_fkey'
            columns: ['membership_id']
            isOneToOne: false
            referencedRelation: 'memberships'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reward_redemptions_reward_program_id_fkey'
            columns: ['reward_program_id']
            isOneToOne: false
            referencedRelation: 'reward_programs'
            referencedColumns: ['id']
          },
        ]
      }
      transaction_batch_queue: {
        Row: {
          batch_id: string | null
          business_id: string
          created_at: string | null
          id: string
          is_recorded: boolean | null
          transaction_id: string
        }
        Insert: {
          batch_id?: string | null
          business_id: string
          created_at?: string | null
          id?: string
          is_recorded?: boolean | null
          transaction_id: string
        }
        Update: {
          batch_id?: string | null
          business_id?: string
          created_at?: string | null
          id?: string
          is_recorded?: boolean | null
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transaction_batch_queue_business_id_fkey'
            columns: ['business_id']
            isOneToOne: false
            referencedRelation: 'businesses'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transaction_batch_queue_transaction_id_fkey'
            columns: ['transaction_id']
            isOneToOne: false
            referencedRelation: 'transactions'
            referencedColumns: ['id']
          },
        ]
      }
      transaction_items: {
        Row: {
          id: number
          price_at_purchase: number
          product_id: string
          quantity: number
          transaction_id: string
        }
        Insert: {
          id?: number
          price_at_purchase: number
          product_id: string
          quantity: number
          transaction_id?: string
        }
        Update: {
          id?: number
          price_at_purchase?: number
          product_id?: string
          quantity?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'transaction_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'transaction_items_transaction_id_fkey'
            columns: ['transaction_id']
            isOneToOne: false
            referencedRelation: 'transactions'
            referencedColumns: ['id']
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          id: string
          membership_id: string
          onchain_proof_hash: string
          payment_status: string | null
          payment_verified_at: string | null
          qris_tx_id: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          id?: string
          membership_id: string
          onchain_proof_hash: string
          payment_status?: string | null
          payment_verified_at?: string | null
          qris_tx_id: string
          total_amount: number
        }
        Update: {
          created_at?: string
          id?: string
          membership_id?: string
          onchain_proof_hash?: string
          payment_status?: string | null
          payment_verified_at?: string | null
          qris_tx_id?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: 'transactions_membership_id_fkey'
            columns: ['membership_id']
            isOneToOne: false
            referencedRelation: 'memberships'
            referencedColumns: ['id']
          },
        ]
      }
      user_wallets: {
        Row: {
          created_at: string | null
          id: string
          network: string | null
          updated_at: string | null
          user_id: string
          wallet_address: string
          wallet_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          network?: string | null
          updated_at?: string | null
          user_id: string
          wallet_address: string
          wallet_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          network?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
          wallet_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_businesses_ready_for_batch: {
        Args: Record<PropertyKey, never>
        Returns: {
          business_id: string
          pending_count: number
        }[]
      }
    }
    Enums: {
      reward_program_type: 'stamp' | 'point' | 'milestone'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      reward_program_type: ['stamp', 'point', 'milestone'],
    },
  },
} as const
