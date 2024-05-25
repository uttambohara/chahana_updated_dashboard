"use client";

import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Tables } from "@/types/supabase";
import { Plus } from "lucide-react";
import SubCategoriesForm from "./sub-category-form";

interface AddNewSubCategoryProps {
  categories: Tables<"category">[] | null;
}

export default function AddNewSubCategory({
  categories,
}: AddNewSubCategoryProps) {
  const { setOpen } = useModal();
  return (
    <Button
      variant={"outline"}
      className="gap-1"
      onClick={() =>
        setOpen(
          <CustomModal title={"Add Sub Category"}>
            <SubCategoriesForm categories={categories} />
          </CustomModal>
        )
      }
    >
      <Plus size={18} />
      New Sub Category
    </Button>
  );
}
