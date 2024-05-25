"use client";

import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Tables } from "@/types/supabase";
import { Plus } from "lucide-react";
import SubCategoriesForm from "./sub-category-form";

export default function AddNewSubCategory() {
  const { setOpen } = useModal();
  return (
    <Button
      variant={"outline"}
      className="gap-1"
      onClick={() =>
        setOpen(
          <CustomModal title={"Add Sub Category"}>
            <SubCategoriesForm />
          </CustomModal>
        )
      }
    >
      <Plus size={18} />
      New Sub Category
    </Button>
  );
}
