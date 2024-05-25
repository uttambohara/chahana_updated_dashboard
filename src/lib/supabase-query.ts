import { supabaseServerClient } from "./supabase/server";

export async function getProductById(productId: number) {
  const supabase = supabaseServerClient();
  let { data: product, error } = await supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*, color(*)), product_size(*, sizes(*))"
    )
    .eq("id", productId);

  return { product, error };
}

export async function getAllProductsForAdmin(productId: number) {
  const supabase = supabaseServerClient();
  let { data: product, error } = await supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*, color(*)), product_size(*, sizes(*))"
    );

  return { product, error };
}

export async function getOrderById(orderId: number) {
  const supabase = supabaseServerClient();
  let { data: order, error } = await supabase
    .from("order")
    .select(
      "*, invoice(*), product(*), customer(*, users(*)), users(*), order_product(*, product(*)), payment(*)"
    )
    .eq("id", orderId);

  return { order, error };
}

export async function getCustomerById(customerId: number) {
  const supabase = supabaseServerClient();
  let { data: customer, error } = await supabase
    .from("customer")
    .select(
      "*, order(*, product(*), payment(*), order_product(*, product(*), order(*))), users(*)"
    )
    .eq("id", customerId);

  return { customer, error };
}

export default async function getUser() {
  const supabase = supabaseServerClient();

  // Extract user from getUser
  const result = await supabase.auth.getUser();
  const { user } = result.data;

  // Supabase query
  const response = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id!)
    .single();
  return response;
}

export async function getAllCategories() {
  const supabase = supabaseServerClient();
  let { data: categories, error } = await supabase
    .from("category")
    .select("*, product(*), sub_category(*)");
  return { categories, error };
}

export async function getAllBillboards() {
  const supabase = supabaseServerClient();
  let { data: billboards, error } = await supabase
    .from("billboard")
    .select("*");
  return { billboards, error };
}

export async function getAllSizes() {
  const supabase = supabaseServerClient();
  let { data: sizes, error } = await supabase.from("sizes").select("*");
  return { sizes, error };
}

export async function getAllColors() {
  const supabase = supabaseServerClient();
  let { data: colors, error } = await supabase.from("color").select("*");
  return { colors, error };
}

export async function getAllSubCategories() {
  const supabase = supabaseServerClient();
  let { data: subCategories, error } = await supabase
    .from("sub_category")
    .select("*, category(*), product(*)");
  return { subCategories, error };
}
