"use server";

import { Database } from "@/types/supabase";

import { supabaseServerClient } from "@/lib/supabase/server";
import { GetTasksSchema } from "./validation";

export async function getAllCustomers(input: GetTasksSchema, vendorId: string) {
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
    .from("customer")
    .select("*, order(*), users(*, order(*))")
    .eq("vendor_id", vendorId);

  // Filtering
  if (fromDay && toDay)
    query = query.gte("created_at", fromDay).lte("created_at", toDay);
  if (order) query = query.order(column, { ascending: order === "asc" });

  if (start && end) query = query.range(start, end);

  const customersCountPromise = supabase
    .from("customer")
    .select("*, order(*), users(*, order(*))")
    .eq("vendor_id", vendorId);

  const [countResponse, customersResponse] = await Promise.all([
    customersCountPromise,
    query,
  ]);

  const { data: allCustomers, count } = countResponse;
  const { data: customers, error } = customersResponse;

  return { totalCount: count, customers, allCustomers, error };
}
