import CustomModal from "@/components/CustomModal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/modal-provider";
import { Edit2 } from "lucide-react";
import CategoriesForm from "./sub-category-form";
import { Tables } from "@/types/supabase";
import SubCategoriesForm from "./sub-category-form";

interface EditSubCategoryProps {
  subCategory: Tables<"sub_category"> & {
    category: Tables<"category"> | null;
  };
}

export default function EditSubCategory({ subCategory }: EditSubCategoryProps) {
  const { setOpen } = useModal();
  return (
    <DropdownMenuItem
      className="gap-2"
      onClick={() =>
        setOpen(
          <CustomModal title={"Edit category"}>
            <SubCategoriesForm subCategory={subCategory} />
          </CustomModal>
        )
      }
    >
      <Edit2 size={18} /> Edit
    </DropdownMenuItem>
  );
}
