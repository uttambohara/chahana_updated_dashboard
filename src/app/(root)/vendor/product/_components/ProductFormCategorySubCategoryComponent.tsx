"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCreateProduct } from "@/providers/create-product-provider";
import { CategoryWithSubCategory } from "@/types";
import { Tables } from "@/types/supabase";
import { ChevronDown, Mail, MessageSquare, UserPlus } from "lucide-react";

interface ProductFormCategorySubCategoryComponentProps {
  categories: CategoryWithSubCategory;
  subCategories: Tables<"sub_category">[] | null;
}

export default function ProductFormCategorySubCategoryComponent({
  categories,
  subCategories,
}: ProductFormCategorySubCategoryComponentProps) {
  const { state, dispatch } = useCreateProduct();

  function handleUpdateCategorySubCategoryDispatch(
    category: Tables<"category">,
    sub_category: Tables<"sub_category">
  ) {
    dispatch({
      type: "SET_CATEGORY_SUBCATEGORY_IDS",
      payload: {
        category,
        sub_category,
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="font-normal text-[14px] text-zinc-500 min-w-[15rem] hover:bg-none flex justify-between underline-offset-8 decoration-gray-300"
        >
          {state.category?.id && state.sub_category?.id ? (
            <span>{`${state.category.name} | ${state.sub_category.name}`}</span>
          ) : (
            <span>Category | sub-category</span>
          )}

          <ChevronDown size={20} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {categories?.map((category) => (
          <DropdownMenuSub key={category.id}>
            <DropdownMenuSubTrigger>
              <span>{category.name}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {category.sub_category.map((sub) => (
                  <DropdownMenuItem
                    key={sub.id}
                    onClick={() =>
                      handleUpdateCategorySubCategoryDispatch(category, sub)
                    }
                  >
                    <span>{sub.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
