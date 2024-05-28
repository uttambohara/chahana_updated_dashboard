"use server";

import { Database } from "@/types/supabase";
import { GetTasksSchema } from "./validations";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function getAllProducts(input: GetTasksSchema, vendorId: string) {
  const { per_page, sort, from, to, start, end } = input;
  //
  const [column, order] = (sort?.split(".").filter(Boolean) ?? [
    "created_at",
    "desc",
  ]) as [
    keyof Database["public"]["Tables"]["product"]["Row"],
    "asc" | "desc" | undefined
  ];

  // Convert the date strings to Date objects
  const fromDay = from ? new Date(from).toLocaleDateString() : undefined;
  const toDay = to ? new Date(to).toLocaleDateString() : undefined;

  const supabase = supabaseServerClient();

  let query = supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*), product_size(*), variants(*)" // Nested selects with aliases
    )
    .eq("user_id", vendorId);

  // Filtering
  if (fromDay && toDay)
    query = query.gte("created_at", fromDay).lte("created_at", toDay);
  if (order) query = query.order(column, { ascending: order === "asc" });

  if (start && end) query = query.range(start, end);

  const productsCountPromise = supabase
    .from("product")
    .select(
      "*, color(*), sizes(*), category(*), sub_category(*), product_color(*), product_size(*), variants(*)"
    )
    .eq("user_id", vendorId);

  const [countResponse, productsResponse] = await Promise.all([
    productsCountPromise,
    query,
  ]);

  const { data: allProducts, count } = countResponse;
  const { data: products, error } = productsResponse;

  return { totalCount: count, products, allProducts, error };
}
