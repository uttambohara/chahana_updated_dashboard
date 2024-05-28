import { supabaseServerClient } from "./supabase/server";

export async function getPaymentByVendorId(vendor_id: number) {
  const supabase = supabaseServerClient();
  let { data: product, error } = await supabase
    .from("payment")
    .select("*,")
    .eq("user", vendor_id);

  return { product, error };
}

export async function getProductById(productId: number) {
  const supabase = supabaseServerClient();
  let { data: product, error } = await supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*, color(*)), product_size(*, sizes(*)), variants(*)"
    )
    .eq("id", productId);

  return { product, error };
}
export async function getCustomerByVendorId(vendor_id: string) {
  const supabase = supabaseServerClient();
  const { data: customer, error } = await supabase
    .from("customer")
    .select("*, order(*), users(*, order(*))")
    .eq("vendor_id", vendor_id);

  console.log(customer);
  return { customer, error };
}

export async function getInvoiceByVendorId(vendor_id: string) {
  const supabase = supabaseServerClient();
  let { data: invoice, error } = await supabase
    .from("invoice")
    .select("*, order(*, order_product(*, product(*))), payment(*)")
    .eq("vendor_id", vendor_id);

  return { invoice, error };
}

export async function getProductByIdVendorId(vendor_id: string) {
  const supabase = supabaseServerClient();
  let { data: product, error } = await supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*, color(*)), product_size(*, sizes(*)), variants(*)"
    )
    .eq("user_id", vendor_id);

  return { product, error };
}

export async function getProductByIdWithVariantColorsAndSizes(
  productId: number
) {
  const supabase = supabaseServerClient();
  let { data: product, error } = await supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*, color(*)), product_size(*, sizes(*)), variants(*, color(*), sizes(*))"
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

export async function getOrderByVendorId(vendorId: string) {
  const supabase = supabaseServerClient();
  let { data: order, error } = await supabase
    .from("order")
    .select(
      "*, invoice(*), product(*), customer(*, users(*)), users(*), order_product(*, product(*)), payment(*)",
      { count: "exact" }
    )
    .eq("vendor_id", vendorId);

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

export async function getAllInvoices() {
  const supabase = supabaseServerClient();
  let { data: invoices, error } = await supabase
    .from("invoice")
    .select("*, order(*, order_product(*, product(*))), payment(*)");

  return { invoices, error };
}

export async function getAllProductsForAdminDashboard() {
  const supabase = supabaseServerClient();
  let { data: products, error } = await supabase.from("product").select("*");
  return { products, error };
}
export async function getAllOrdersForAdminDashboard() {
  const supabase = supabaseServerClient();
  let { data: orders, error } = await supabase.from("order").select("*");
  return { orders, error };
}
export async function getAllUsersForAdminDashboard() {
  const supabase = supabaseServerClient();
  let { data: users, error } = await supabase.from("users").select("*");
  return { users, error };
}

export async function getAllForAdminDashboard() {
  const supabase = supabaseServerClient();
  let { data: products, error } = await supabase.from("product").select("*");
  return { products, error };
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
