import CustomModal from "@/components/CustomModal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/modal-provider";
import { Edit2 } from "lucide-react";
import React from "react";
import CategoriesForm from "./category-form";
import { Tables } from "@/types/supabase";

interface EditCategoryProps {
  category: Tables<"category"> & { product: Tables<"product">[] };
}

export default function EditCategory({ category }: EditCategoryProps) {
  const { setOpen } = useModal();
  return (
    <DropdownMenuItem
      className="gap-2"
      onClick={() =>
        setOpen(
          <CustomModal title={"Edit category"}>
            <CategoriesForm category={category} />
          </CustomModal>
        )
      }
    >
      <Edit2 size={18} /> Edit
    </DropdownMenuItem>
  );
}
