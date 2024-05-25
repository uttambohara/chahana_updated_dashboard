"use server";

import { registerFormSchema } from "@/types/form-schemas";
import { supabaseServerClient } from "@/lib/supabase/server";

export const supabaseRegister = async (values: unknown) => {
  const result = registerFormSchema.safeParse(values);
  if (!result.success)
    return { status: "error", message: "Invalid input value" };
  const supabase = supabaseServerClient();

  const { email, password, ...other } = result.data;
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...other,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: JSON.stringify(error),
    };
  }

  return {
    status: "success",
    message: "Verification link sent to your email",
  };
};
