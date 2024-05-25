export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      billboard: {
        Row: {
          created_at: string
          id: number
          image_url: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          id: number
          image_url: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      color: {
        Row: {
          created_at: string
          hex: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          hex: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          hex?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      customer: {
        Row: {
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice: {
        Row: {
          created_at: string
          customer_id: number
          dueDate: string | null
          id: number
          order_id: number
          vendor_id: string
        }
        Insert: {
          created_at?: string
          customer_id: number
          dueDate?: string | null
          id?: number
          order_id: number
          vendor_id: string
        }
        Update: {
          created_at?: string
          customer_id?: number
          dueDate?: string | null
          id?: number
          order_id?: number
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          created_at: string
          customer_id: number | null
          id: number
          order_date: string
          refund_reason: string | null
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"]
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          customer_id?: number | null
          id?: number
          order_date?: string
          refund_reason?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: number | null
          id?: number
          order_date?: string
          refund_reason?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      order_product: {
        Row: {
          created_at: string
          id: number
          order_id: number
          product_id: number
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: number
          order_id: number
          product_id: number
          quantity: number
        }
        Update: {
          created_at?: string
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_product_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      payment: {
        Row: {
          amount: number
          created_at: string
          customer_id: number | null
          id: number
          invoice_id: number | null
          method: Database["public"]["Enums"]["payment_method"]
          order_id: number | null
          paid_at: string
          status: Database["public"]["Enums"]["payment_status"] | null
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id?: number | null
          id?: number
          invoice_id?: number | null
          method: Database["public"]["Enums"]["payment_method"]
          order_id?: number | null
          paid_at?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: number | null
          id?: number
          invoice_id?: number | null
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: number | null
          paid_at?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
        ]
      }
      product: {
        Row: {
          category_id: number
          created_at: string
          description: string
          discount: number
          discountable: boolean | null
          height: number | null
          id: number
          length: number | null
          material: string
          name: string
          productImgs: string
          quantity: number
          salesPrice: number
          sku: string
          status: Database["public"]["Enums"]["create_product_status"]
          sub_category_id: number
          user_id: string
          weight: number | null
          width: number | null
        }
        Insert: {
          category_id: number
          created_at?: string
          description: string
          discount: number
          discountable?: boolean | null
          height?: number | null
          id?: number
          length?: number | null
          material: string
          name: string
          productImgs: string
          quantity: number
          salesPrice: number
          sku: string
          status?: Database["public"]["Enums"]["create_product_status"]
          sub_category_id: number
          user_id: string
          weight?: number | null
          width?: number | null
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string
          discount?: number
          discountable?: boolean | null
          height?: number | null
          id?: number
          length?: number | null
          material?: string
          name?: string
          productImgs?: string
          quantity?: number
          salesPrice?: number
          sku?: string
          status?: Database["public"]["Enums"]["create_product_status"]
          sub_category_id?: number
          user_id?: string
          weight?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      product_color: {
        Row: {
          color_id: number
          created_at: string
          ean: string | null
          product_id: number
          quantity: number | null
          sku: string | null
        }
        Insert: {
          color_id: number
          created_at?: string
          ean?: string | null
          product_id: number
          quantity?: number | null
          sku?: string | null
        }
        Update: {
          color_id?: number
          created_at?: string
          ean?: string | null
          product_id?: number
          quantity?: number | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_color_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "color"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_color_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
        ]
      }
      product_size: {
        Row: {
          created_at: string
          ean: string | null
          product_id: number
          quantity: number | null
          size_id: number
          sku: string | null
        }
        Insert: {
          created_at?: string
          ean?: string | null
          product_id: number
          quantity?: number | null
          size_id: number
          sku?: string | null
        }
        Update: {
          created_at?: string
          ean?: string | null
          product_id?: number
          quantity?: number | null
          size_id?: number
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_size_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_size_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          code: string
          created_at: string
          id: number
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      sub_category: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          image_url: string | null
          name: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          image_url?: string | null
          name?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          image_url?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          role: string
        }
        Insert: {
          address: string
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          role: string
        }
        Update: {
          address?: string
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      create_product_status: "Published" | "Draft" | "Scheduled"
      order_status: "PENDING" | "REFUNDED" | "CANCELED" | "COMPLETED"
      payment_method:
        | "CASH"
        | "CARD"
        | "ESEWA"
        | "CONNECT_IPS"
        | "CASH ON DELIVERY"
      payment_status: "PAID" | "CANCELED" | "PENDING"
      user_role: "ADMIN" | "VENDOR" | "CUSTOMER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
