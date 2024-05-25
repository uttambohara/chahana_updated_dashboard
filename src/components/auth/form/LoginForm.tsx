"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { LoginFormSchema, loginFormSchema } from "@/types/form-schemas";
import AuthForgetPassword from "@/components/auth/AuthForgetPassword";
import AuthCardProviders from "@/components/auth/AuthCardProviders";
import AuthAlert from "@/components/auth/AuthAlert";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import { supbaseLogin } from "@/actions/supabase/supabase-login";

interface LoginFormProps {
  hasFooterLink: boolean;
}

export default function LoginForm({ hasFooterLink }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormSchema) {
    startTransition(async function () {
      const response = await supbaseLogin(values);
      if (response?.status === "error ") {
        setErrorMessage(response.message);
      }
      router.push("/");
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input required type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <AuthForgetPassword />
        </div>

        <AuthCardProviders />
        {errorMessage && <AuthAlert type={"error"} message={errorMessage} />}
        <AuthCardFooter
          isPending={isPending}
          linkType="Sign up"
          authType={"Sign in"}
          footerLinkMsg={"Don't have an account"}
          footerLink={"/auth/register"}
          hasFooterLink={hasFooterLink}
        />
      </form>
    </Form>
  );
}
