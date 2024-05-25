"use server";

import { Database } from "@/types/supabase";

import { supabaseServerClient } from "@/lib/supabase/server";
import { GetTasksSchema } from "./validation";

export async function getAllOrders(input: GetTasksSchema) {
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
    .from("order")
    .select(
      "*, product(*), customer(*, users(*)), users(*), order_product(*, product(*)), payment(*)"
    );

  // Filtering
  if (fromDay && toDay)
    query = query.gte("created_at", fromDay).lte("created_at", toDay);
  if (order) query = query.order(column, { ascending: order === "asc" });

  if (start && end) query = query.range(start, end);

  const ordersCountPromise = supabase
    .from("order")
    .select(
      "*, product(*), customer(*, users(*)), users(*), order_product(*, product(*)), payment(*)",
      {
        count: "exact",
      }
    );

  const [countResponse, ordersResponse] = await Promise.all([
    ordersCountPromise,
    query,
  ]);

  const { data: allOrders, count } = countResponse;
  const { data: orders, error } = ordersResponse;

  return { totalCount: count, orders, allOrders, error };
}
