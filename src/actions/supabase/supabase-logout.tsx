"use server";

import { supabaseServerClient } from "@/lib/supabase/server";

export const supabaseLogout = async () => {
  const supabase = supabaseServerClient();
  await supabase.auth.signOut();
};
