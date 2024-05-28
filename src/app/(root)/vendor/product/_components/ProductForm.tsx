"use client";

import {
  deleteVariantBasedOnProductId,
  insertInVariant,
  upsertProduct,
} from "@/actions/supabase/supabase-db";
import { useCreateProduct } from "@/providers/create-product-provider";
import { useUploadImage } from "@/providers/upload-image-provider";
import {
  CategoryWithSubCategory,
  TProductWithCategorySubCategoryWithColorWithSizes,
} from "@/types";
import { Tables } from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { coerce, z } from "zod";
import useInitProductData from "../_hooks/use-init-product-data";

import { useModal } from "@/providers/modal-provider";
import { validateProductData } from "../_utils";
import ProductCreateForm from "./ProductCreateForm";
import ProductUpdateForm from "./ProductUpdateForm";

interface ProductFormProps {
  productBasedOnParamId?: TProductWithCategorySubCategoryWithColorWithSizes;
  user_id: string;
  categories: CategoryWithSubCategory;
  subCategories: Tables<"sub_category">[] | null;
  sizes: Tables<"sizes">[] | null;
  colors: Tables<"color">[] | null;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  material: z.string().min(2, {
    message: "Material must be at least 2 characters.",
  }),
  discountable: z.boolean().default(true),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  salesPrice: coerce.number().positive({
    message: "Price must be greater than 0",
  }),
  discount: coerce.number().optional(),
  width: coerce.number().optional(),
  height: coerce.number().optional(),
  length: coerce.number().optional(),
  weight: coerce.number().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;

export function ProductForm({
  productBasedOnParamId,
  user_id, // always required
  categories,
  subCategories,
  sizes,
  colors,
}: ProductFormProps) {
  const router = useRouter();
  const [isDraft, setIsDraft] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { setClose } = useModal();

  const { state: CreateProductState, dispatch: CreateProductDispatch } =
    useCreateProduct();
  const { state: ImageState, dispatch: ImageDispatch } = useUploadImage();

  //...
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      material: "",
      description: "",
      salesPrice: 0,
      discount: 0,
      discountable: false,
      height: 0,
      width: 0,
      weight: 0,
      length: 0,
    },
  });

  const paramProductAlreadyExistCaseOfUpdate =
    productBasedOnParamId && productBasedOnParamId[0]?.id;

  // ...
  // Load initial data
  useInitProductData({
    productBasedOnParamId,
    form,
    CreateProductDispatch,
    ImageDispatch,
  });
  console.log(CreateProductState.variants);
  // Handle form submit
  async function onSubmit(values: FormSchema) {
    const { category, sub_category, variants } = CreateProductState;
    const { productImgs } = ImageState;

    // Data prep
    let finalData = {
      id: productBasedOnParamId?.[0]?.id,
      user_id,
      ...values,
      category_id: category?.id as number,
      sub_category_id: sub_category?.id as number,
      productImgs: JSON.stringify(productImgs),
      created_at: new Date().toISOString(),
      status: isDraft ? "Draft" : "Published",

      // colors (product_color/ needs manual mutation)
      // sizes (product_sizes)
    };

    // Validation
    const checkData = {
      ...values,
      category_id: category?.id as number,
      sub_category_id: sub_category?.id as number,
      productImgs,
      variants: variants.filter(
        (variant) => variant.color_id && variant.size_id
      ),
    };

    const errors = validateProductData(checkData);
    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
      return;
    }

    // Mutation
    try {
      setIsCreating(true);

      // Upsert product (...basic/ excluding colors and sizes)
      const response = await upsertProduct(finalData as any); //
      const { data: updatedProductData, error } = JSON.parse(response);
      if (error) throw new Error(JSON.stringify(error));
      const productIdFromPOSTresponse = updatedProductData[0].id;

      // 1)
      if (!paramProductAlreadyExistCaseOfUpdate) {
        const mapAllVariantContent = variants
          .filter((variant) => variant.color_id && variant.size_id)
          .map((variant) => {
            const finalVariant = {
              ...variant,
              product_id: productIdFromPOSTresponse,
            };

            return insertInVariant(finalVariant);
          });

        await Promise.all(mapAllVariantContent);
      }

      // 2)
      if (paramProductAlreadyExistCaseOfUpdate) {
        const filteredVariants = variants.filter(
          (variant) => variant.color_id && variant.size_id
        ); // Filter valid variants

        console.log(filteredVariants);
        console.log({ variants });
        try {
          await deleteVariantBasedOnProductId(productBasedOnParamId[0].id); // Remove existing variants (if applicable)

          const updatePromises = filteredVariants.map(async (variant) => {
            const finalVariant = {
              ...variant,
              product_id: productBasedOnParamId[0].id,
            };
            insertInVariant(finalVariant); // Update or insert each variant asynchronously
          });

          const response = await Promise.all(updatePromises); // Wait for all variant updates to finish
          console.log(response);
          console.log({ variants: filteredVariants }); // Log updated variants (optional)
        } catch (error) {
          console.error("Error updating variants:", error); // Log errors gracefully
        }
      }

      // Reset
      if (!paramProductAlreadyExistCaseOfUpdate) {
        form.reset();
        CreateProductDispatch({
          type: "RESET",
        });
        ImageDispatch({
          type: "RESET",
        });
      }

      setClose();
      //
      toast.success(
        `Product data ${
          paramProductAlreadyExistCaseOfUpdate
            ? "updated"
            : isDraft
            ? "drafted"
            : "created"
        }`
      );

      router.refresh();
    } catch (err) {
      setIsCreating(false);
      console.log(err);
      toast.error(JSON.stringify(err));
    } finally {
      setIsCreating(false);
    }
  }

  // Create product form
  if (!productBasedOnParamId)
    return (
      <ProductCreateForm
        setIsDraft={setIsDraft}
        form={form}
        categories={categories}
        subCategories={subCategories}
        sizes={sizes}
        colors={colors}
        onSubmit={onSubmit}
        isCreating={isCreating}
        paramProductAlreadyExistCaseOfUpdate={
          paramProductAlreadyExistCaseOfUpdate
        }
        isDraft={isDraft}
      />
    );

  // Update product form
  return (
    <ProductUpdateForm
      form={form}
      categories={categories}
      subCategories={subCategories}
      sizes={sizes}
      colors={colors}
      onSubmit={onSubmit}
      isCreating={isCreating}
      paramProductAlreadyExistCaseOfUpdate={
        paramProductAlreadyExistCaseOfUpdate
      }
      isDraft={isDraft}
    />
  );
}
