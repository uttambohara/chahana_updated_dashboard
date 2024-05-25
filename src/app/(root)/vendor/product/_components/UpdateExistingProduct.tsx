import { CreateProductProvider } from "@/providers/create-product-provider";
import { UploadImageProvider } from "@/providers/upload-image-provider";
import {
  CategoryWithSubCategory,
  TProductWithCategorySubCategoryWithColorWithSizes,
} from "@/types";
import { Tables } from "@/types/supabase";
import React from "react";
import { ProductForm } from "./ProductForm";

interface UpdateExistingProductProps {
  productBasedOnParamId?: TProductWithCategorySubCategoryWithColorWithSizes;
  categories: CategoryWithSubCategory;
  subCategories: Tables<"sub_category">[] | null;
  sizes: Tables<"sizes">[] | null;
  colors: Tables<"color">[] | null;
  userId: string;
}

export default function UpdateExistingProduct({
  productBasedOnParamId,
  categories,
  subCategories,
  sizes,
  colors,
  userId,
}: UpdateExistingProductProps) {
  return (
    <CreateProductProvider>
      <UploadImageProvider>
        <div className="max-w-full mx-auto">
          <ProductForm
            user_id={userId}
            categories={categories}
            subCategories={subCategories}
            productBasedOnParamId={productBasedOnParamId}
            sizes={sizes}
            colors={colors}
          />
        </div>
      </UploadImageProvider>
    </CreateProductProvider>
  );
}
