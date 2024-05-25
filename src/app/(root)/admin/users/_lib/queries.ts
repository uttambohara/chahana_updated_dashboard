import "server-only";

import { supabaseServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { unstable_noStore as noStore } from "next/cache";
import { GetTasksSchema } from "./validations";

export async function getAllUser(input: GetTasksSchema) {
  noStore();
  const { per_page, sort, from, to, start, end } = input;

  //
  const [column, order] = (sort?.split(".").filter(Boolean) ?? [
    "created_at",
    "desc",
  ]) as [
    keyof Database["public"]["Tables"]["users"]["Row"],
    "asc" | "desc" | undefined
  ];

  // Convert the date strings to Date objects
  const fromDay = from ? new Date(from).toLocaleDateString() : undefined;
  const toDay = to ? new Date(to).toLocaleDateString() : undefined;

  const supabase = supabaseServerClient();
  let query = supabase.from("users").select("*").limit(per_page);

  // Filtering
  if (fromDay && toDay)
    query = query.gte("created_at", fromDay).lte("created_at", toDay);
  if (order) query = query.order(column, { ascending: order === "asc" });

  if (start && end) query = query.range(start, end);

  const usersCountPromise = supabase
    .from("users")
    .select("*", { count: "exact" });

  const [countResponse, usersResponse] = await Promise.all([
    usersCountPromise,
    query,
  ]);

  const { data: allUsers, count } = countResponse;
  const { data: users, error } = usersResponse;

  return { totalCount: count, users, allUsers, error };
}
