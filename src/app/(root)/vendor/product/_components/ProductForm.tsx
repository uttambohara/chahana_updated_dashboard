"use client";

import {
  deleteEverythingFromProductColorRelationIfProductIdMatches,
  deleteEverythingFromProductSizeRelationIfProductIdMatches,
  insertInProductColorRelation,
  insertInProductSizeRelation,
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
  sku: z.string().min(2, {
    message: "SKU must be at least 2 characters.",
  }),
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
  quantity: coerce
    .number()
    .positive({
      message: "Quantity must be greater than 0",
    })
    .refine((value) => String(value).length <= 2, {
      message: "Quantity must be a 1 or 2 digit number",
    }),
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
      quantity: 0,
      description: "",
      salesPrice: 0,
      discount: 0,
      sku: "",
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

  // Handle form submit
  async function onSubmit(values: FormSchema) {
    const { category, sub_category, colors, sizes } = CreateProductState;
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
      colors,
      sizes,
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
        // product_color
        // product_size
        const mapAllColorsFromFormForInsertionInProductColor = colors.map(
          (color) =>
            insertInProductColorRelation(productIdFromPOSTresponse, color.id)
        );
        const mapAllSizesFromFormForInsertionInProductSize = sizes.map((size) =>
          insertInProductSizeRelation(productIdFromPOSTresponse, size.id)
        );
        const allSizesAndColors = [
          ...mapAllColorsFromFormForInsertionInProductColor,
          ...mapAllSizesFromFormForInsertionInProductSize,
        ];
        await Promise.all(allSizesAndColors);
      }

      // 2)
      if (paramProductAlreadyExistCaseOfUpdate) {
        // Delete everything from the previous entry / clear
        await Promise.all([
          deleteEverythingFromProductSizeRelationIfProductIdMatches(
            productBasedOnParamId[0].id
          ),
          deleteEverythingFromProductColorRelationIfProductIdMatches(
            productBasedOnParamId[0].id
          ),
        ]);

        // Insert everything anew from the preserved client side state
        const mapAllColorsFromFormForInsertionInProductColor = colors.map(
          (color) =>
            insertInProductColorRelation(productBasedOnParamId[0].id, color.id)
        );
        const mapAllSizesFromFormForInsertionInProductSize = sizes.map((size) =>
          insertInProductSizeRelation(productBasedOnParamId[0].id, size.id)
        );
        const allSizesAndColors = [
          ...mapAllColorsFromFormForInsertionInProductColor,
          ...mapAllSizesFromFormForInsertionInProductSize,
        ];
        await Promise.all(allSizesAndColors);
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
