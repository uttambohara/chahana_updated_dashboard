export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

import { Tables } from "./supabase";

export type TProductWithCategorySubColorAndSizes =
  | Tables<"product"> & {
      product_color: Tables<"product_color">[];
      product_size: Tables<"product_size">[];
      category: Tables<"category"> | null;
    } & { sub_category: Tables<"sub_category"> | null } & {
      color: Tables<"color">[] | null;
    } & { sizes: Tables<"sizes">[] | null };

export type TProductSupabaseUpsert = Tables<"product">;

export type TProductWithCategorySubCategoryWithColorWithSizes =
  | (Tables<"product"> & { category: Tables<"category"> | null } & {
      sub_category: Tables<"sub_category"> | null;
      color: Tables<"color">[] | null;
      sizes: Tables<"sizes">[] | null;
    })[]
  | null
  | undefined;

export type OrderWithCustomer = Tables<"order"> & {
  product: Tables<"product">[];
} & {
  customer: (Tables<"customer"> & { users: Tables<"users"> | null }) | null;
} & {
  users: Tables<"users"> | null;
} & {
  order_product: (Tables<"order_product"> & {
    product: Tables<"product"> | null;
  })[];
} & { payment: Tables<"payment">[] | null };

export type InvoiceWithOrderUserAndPayment = Tables<"invoice"> & {
  order:
    | (Tables<"order"> & { product: Tables<"product">[] } & {
        order_product: (Tables<"order_product"> & {
          product: Tables<"product"> | null;
        })[];
      })
    | null;
} & { users: Tables<"users"> | null } & { payment: Tables<"payment">[] } & {
  customer: (Tables<"customer"> & { users: Tables<"users"> | null }) | null;
};

export type CategoryWithSubCategory =
  | (Tables<"category"> & { sub_category: Tables<"sub_category">[] })[]
  | null;

export type CustomersT = Tables<"customer"> & {
  users: (Tables<"users"> & { order: Tables<"order">[] }) | null;
} & { order: Tables<"order">[] };
