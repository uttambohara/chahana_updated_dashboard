import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export type UserRole = "CUSTOMER" | "VENDOR";

export const registerFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  phone: z.string().min(2, {
    message: "Phone number must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  role: z.enum(["VENDOR", "CUSTOMER"]),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
