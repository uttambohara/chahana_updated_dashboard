"use server";

import { supabaseServerClient } from "@/lib/supabase/server";

export async function deleteSupbaseImage(postImageName: string) {
  const supabase = supabaseServerClient();
  const response = await supabase.storage
    .from("product_upload")
    .remove([postImageName]);

  return JSON.stringify(response);
}

export async function deleteSupbaseImageFromAdmin(
  folderPath: string,
  postImageName: string
) {
  const completeImagePath = folderPath + postImageName;
  const supabase = supabaseServerClient();
  const response = await supabase.storage
    .from("admin")
    .remove([completeImagePath]);

  return JSON.stringify(response);
}
