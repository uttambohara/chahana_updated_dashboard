"use server";

import { loginFormSchema } from "@/types/form-schemas";
import { supabaseServerClient } from "@/lib/supabase/server";

export const supbaseLogin = async (values: unknown) => {
  // Validation
  const result = loginFormSchema.safeParse(values);
  if (!result.success)
    return { status: "error", message: "Invalid input value!" };
  const supabase = supabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(result.data);
  if (error) {
    return {
      status: "error",
      message: JSON.stringify(error),
    };
  }
};
