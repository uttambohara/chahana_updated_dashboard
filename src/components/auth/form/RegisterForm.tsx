"use client";

import { supabaseRegister } from "@/actions/supabase/supabase-register";
import AuthAlert from "@/components/auth/AuthAlert";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import SocialLoginLink from "@/components/auth/AuthCardProviders";
import AuthRoleSelect from "@/components/auth/AuthRoleSelect";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  RegisterFormSchema,
  UserRole,
  registerFormSchema,
} from "@/types/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface RegisterFormProps {
  hasSocialLink: boolean;
  hasFooterLink: boolean;
}

export default function RegisterForm({
  hasSocialLink,
  hasFooterLink,
}: RegisterFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      role: "VENDOR" as UserRole,
    },
  });

  function onSubmit(values: RegisterFormSchema) {
    startTransition(async function () {
      const auth = await supabaseRegister(values);
      if (auth?.status === "error") {
        setErrorMessage(auth.message);
      } else {
        setSuccessMessage("Verification link sent to your email");
      }
      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name*</FormLabel>
                <FormControl>
                  <Input placeholder="Lee" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name*</FormLabel>
                <FormControl>
                  <Input placeholder="Robinson" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone*</FormLabel>
              <FormControl>
                <Input placeholder="Phone" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address*</FormLabel>
              <FormControl>
                <Input placeholder="123Street" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input
                  placeholder="m@example.com"
                  required
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password*</FormLabel>
              <FormControl>
                <Input required type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role*</FormLabel>
              <FormControl>
                <AuthRoleSelect field={field} />
              </FormControl>
              <FormMessage />
              <FormMessage />
            </FormItem>
          )}
        />

        {hasSocialLink && <SocialLoginLink />}

        {successMessage && (
          <AuthAlert type={"success"} message={successMessage} />
        )}
        {errorMessage && <AuthAlert type={"error"} message={errorMessage} />}

        <AuthCardFooter
          linkType="Sign in"
          authType={"Sign up"}
          footerLinkMsg={"Already have an account"}
          footerLink={"/auth/login"}
          isPending={isPending}
          hasFooterLink={hasFooterLink}
        />
      </form>
    </Form>
  );
}
