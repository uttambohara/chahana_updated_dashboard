"use client";

import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { CreateProductProvider } from "@/providers/create-product-provider";
import { useModal } from "@/providers/modal-provider";
import { UploadImageProvider } from "@/providers/upload-image-provider";
import {
  CategoryWithSubCategory,
  TProductWithCategorySubCategoryWithColorWithSizes,
} from "@/types";
import { Tables } from "@/types/supabase";
import { Plus } from "lucide-react";
import { ProductForm } from "./ProductForm";

interface CreateNewProductProps {
  productBasedOnParamId?: TProductWithCategorySubCategoryWithColorWithSizes;
  categories: CategoryWithSubCategory;
  subCategories: Tables<"sub_category">[] | null;
  sizes: Tables<"sizes">[] | null;
  colors: Tables<"color">[] | null;
  userId: string;
}

export default function CreateNewProduct({
  categories,
  subCategories,
  sizes,
  colors,
  productBasedOnParamId,
  userId,
}: CreateNewProductProps) {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal
            title={""}
            subheading=""
            className="h-full min-w-full overflow-scroll"
          >
            <CreateProductProvider>
              <UploadImageProvider>
                <div className="max-w-screen-lg mx-auto">
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
          </CustomModal>
        )
      }
    >
      <Plus size={18} /> New product
    </Button>
  );
}
