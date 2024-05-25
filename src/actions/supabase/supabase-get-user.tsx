import { supabaseServerClient } from "@/lib/supabase/server";

export default async function supabaseGetUser() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
