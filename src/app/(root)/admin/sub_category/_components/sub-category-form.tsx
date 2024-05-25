"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSubCategory } from "@/actions/supabase/supabase-db";
import LoaderEl from "@/components/LoaderEl";
import FileUploadImage from "@/components/fileUpload/FileUploadImage";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/providers/modal-provider";
import { Tables } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  image_url: z.string().min(2, {
    message: "Image URL must be at least 2 characters.",
  }),
  category_id: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

interface SubCategoriesFormProps {
  categories: Tables<"category">[] | null;
}

export default function SubCategoriesForm({
  categories,
}: SubCategoriesFormProps) {
  const { setClose } = useModal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  function onSubmit(values: FormSchema) {
    startTransition(async () => {
      const response = await createSubCategory({
        ...values,
        category_id: Number(values.category_id),
      });
      const { _, error } = JSON.parse(response);
      if (error) {
        toast.error(JSON.stringify(error));
      }
      router.refresh();
      form.reset();
      setClose();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="Male.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category*</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="text-muted-foreground bg-zinc-50">
                    <SelectValue placeholder="Clothing.." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem value={String(category.id)} key={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo*</FormLabel>
              <FormControl>
                <FileUploadImage
                  fileNumber={1}
                  bucketName={"admin"}
                  value={field.value}
                  folderName={"sub_categories"}
                  onChange={(imgArrInString: string) => {
                    field.onChange(imgArrInString);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="flex ml-auto">
          {isPending && <LoaderEl />}
          Create Sub Category
        </Button>
      </form>
    </Form>
  );
}
