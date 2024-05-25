"use server";

import { ORDER_STATUS } from "@/lib/constant";
import { supabaseServerClient } from "@/lib/supabase/server";
import { TProductSupabaseUpsert } from "@/types";
import { Database, Tables } from "@/types/supabase";

export async function createDuplicateProduct(productId: number) {
  const supabase = supabaseServerClient();
  const { data: product, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", productId);

  if (error) {
    console.error("Error fetching product:", error);
  }
  const productObj = product?.[0];

  const duplicateProduct = { ...productObj }; // Create a copy
  duplicateProduct.id = undefined; // Assuming ID is auto-generated
  duplicateProduct.name += " (Copy)";

  const finalProduct = { ...duplicateProduct };

  const response = await supabase
    .from("product")
    .insert(finalProduct as Tables<"product">)
    .select();

  return JSON.stringify(response);
}

// Create
export async function createCategory(categoryObj: {
  name: string;
  image_url: string;
}) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("category")
    .upsert({ ...categoryObj })
    .select();

  return JSON.stringify(response);
}

export async function createColor(categoryObj: { name: string; hex: string }) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("color")
    .upsert({ ...categoryObj })
    .select();

  return JSON.stringify(response);
}

export async function createPayment(paymentObj: {
  amount: number;
  customer_id: number | null;
  invoice_id: number | null | undefined;
  method: "CASH" | "CARD" | "ESEWA" | "CONNECT_IPS" | "CASH ON DELIVERY";
  order_id: number;
}) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("payment")
    .insert([{ ...paymentObj }])
    .select();

  console.log(response);
  return JSON.stringify(response);
}

export async function createSize(categoryObj: { name: string; code: string }) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("sizes")
    .upsert({ ...categoryObj })
    .select();

  return JSON.stringify(response);
}

export async function createSubCategory(categoryObj: {
  name: string;
  image_url: string;
  category_id: number;
}) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("sub_category")
    .upsert({ ...categoryObj })
    .select();

  return JSON.stringify(response);
}

// Update
export async function uploadBillboardImages(
  images: { name: string; image: string }[]
) {
  const supabase = supabaseServerClient();
  const supabaseImagesPromise = images.map((image) =>
    supabase
      .from("billboard")
      .insert([{ name: image.name, image_url: image.image }])
      .select()
  );
  const response = await Promise.all(supabaseImagesPromise);
  return response;
}

export async function updateUserRole(newRole: string, userId: string) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("users")
    .update({ role: newRole })
    .match({ id: userId });

  return JSON.stringify(response);
}

export async function updateProductPublishedStatus(
  productId: number,
  status: "Published" | "Draft"
) {
  const supabase = supabaseServerClient();

  const response = await supabase
    .from("product")
    .update({ status })
    .match({ id: productId });

  return JSON.stringify(response);
}

export type OrderStatusType = (typeof ORDER_STATUS)[number];
export type OrderStatusWithoutAll = Exclude<OrderStatusType, "ALL">;

export async function updateOrderStatusByOrderId(
  orderId: number,
  status: OrderStatusWithoutAll,
  refund_reason?: string
) {
  if (status === "PENDING") refund_reason = "";

  const supabase = supabaseServerClient();
  const response = await supabase
    .from("order")
    .update({ status, refund_reason })
    .eq("id", orderId)
    .select();

  if (status === "PENDING" || status === "CANCELED" || status === "REFUNDED") {
    const payment = await supabase
      .from("payment")
      .delete()
      .eq("order_id", orderId);

    console.log(payment);
  }

  return JSON.stringify(response);
}

// Delete
export async function deleteTableBy(
  table: keyof Database["public"]["Tables"],
  column: string,
  value: string | number
) {
  const supabase = supabaseServerClient();
  const response = await supabase.from(table).delete().eq(column, value);
  return JSON.stringify(response);
}

export async function deleteEverythingFromProductColorRelationIfProductIdMatches(
  product_id: number
) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("product_color")
    .delete()
    .match({ product_id });
  return JSON.stringify(response);
}

export async function deleteEverythingFromProductSizeRelationIfProductIdMatches(
  product_id: number
) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("product_size")
    .delete()
    .match({ product_id });
  return JSON.stringify(response);
}

// insert
export async function insertInProductColorRelation(
  product_id: number,
  color_id: number
) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("product_color")
    .insert({ product_id, color_id });
  return JSON.stringify(response);
}

export async function insertInProductSizeRelation(
  product_id: number,
  size_id: number
) {
  const supabase = supabaseServerClient();
  const response = await supabase
    .from("product_size")
    .insert({ product_id, size_id });
  return JSON.stringify(response);
}

export async function deleteImgFromBucket(
  bucketName: string,
  imgName: string,
  folder: string
) {
  const supabase = supabaseServerClient();
  const response = await supabase.storage
    .from(bucketName)
    .remove([`${folder}/${imgName}`]);
  return response;
}

// upsert
export async function upsertProduct(data: TProductSupabaseUpsert) {
  const supabase = supabaseServerClient();
  const response = await supabase.from("product").upsert(data).select();
  return JSON.stringify(response);
}
