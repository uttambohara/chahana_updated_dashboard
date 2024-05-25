"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  createSubCategory,
  updateSubCategory,
} from "@/actions/supabase/supabase-db";
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
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteSupbaseImageFromAdmin } from "@/actions/supabase/supabase-image";
import { getAllCategories } from "@/lib/supabase-query";
import { supabaseBrowserClient } from "@/lib/supabase/client";

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

interface subCategoryFormProps {
  subCategory?: Tables<"sub_category"> & {
    category: Tables<"category"> | null;
  };
}

export default function subCategoryForm({ subCategory }: subCategoryFormProps) {
  const [allCategories, setAllCategories] = useState<
    Tables<"category">[] | null
  >([]);
  const { setClose } = useModal();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowserClient();
      let { data: category, error } = await supabase
        .from("category")
        .select("*");

      setAllCategories(category);
    })();
  }, []);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subCategory?.name || "",
      category_id: String(subCategory?.category_id) || "",
      image_url: subCategory?.image_url || "",
    },
  });

  useEffect(
    () =>
      form.reset({
        name: subCategory?.name || "",
        category_id: String(subCategory?.category_id) || "",
        image_url: subCategory?.image_url || "",
      }),
    []
  );

  function onSubmit(values: FormSchema) {
    if (subCategory && subCategory.id) {
      //
      startTransition(async () => {
        //
        const existingImage = JSON.parse(subCategory.image_url!)[0].name;

        await deleteSupbaseImageFromAdmin("sub_categories/", existingImage);
        const response = await updateSubCategory({
          id: subCategory.id,
          name: values.name,
          category_id: Number(values.category_id),
          image_url: values.image_url,
        });
        const { _, error } = JSON.parse(response);
        if (error) {
          toast.error(JSON.stringify(error));
        }
        router.refresh();
        form.reset();
        setClose();
      });
    } else {
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
                    {allCategories?.map((category) => (
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
          {subCategory && subCategory.id
            ? "Update  Sub Category"
            : "Create Sub Category"}
        </Button>
      </form>
    </Form>
  );
}
