"use client";

import { createColor } from "@/actions/supabase/supabase-db";
import LoaderEl from "@/components/LoaderEl";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const SketchPicker = dynamic(() => import("@/components/ColorPicker"), {
  ssr: false,
});

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  hex: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function ColorCardForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      hex: "",
    },
  });

  function onSubmit(values: FormSchema) {
    startTransition(async () => {
      const response = await createColor(values);
      const { _, error } = JSON.parse(response);
      if (error) {
        toast.error(JSON.stringify(error));
      } else {
        toast.success(`${values.name}: ${values.hex} added.`);
      }

      router.refresh();
      form.reset();
    });
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Manage Colors</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 p-4 bg-zinc-100"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter color name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HEX</FormLabel>
                <FormControl>
                  <SketchPicker
                    value={field.value}
                    onChange={(hex: string) => field.onChange(hex)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending && <LoaderEl />}
            Add color
          </Button>
        </form>
      </Form>
    </div>
  );
}
