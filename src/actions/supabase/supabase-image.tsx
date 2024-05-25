"use server";

import { supabaseServerClient } from "@/lib/supabase/server";

export async function deleteSupbaseImage(postImageName: string) {
  const supabase = supabaseServerClient();
  const response = await supabase.storage
    .from("product_upload")
    .remove([postImageName]);

  return JSON.stringify(response);
}
