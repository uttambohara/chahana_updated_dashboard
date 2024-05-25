import CustomModal from "@/components/CustomModal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/modal-provider";
import { Edit2 } from "lucide-react";
import CategoriesForm from "./sub-category-form";

export default function EditCategory() {
  const { setOpen } = useModal();
  return (
    <DropdownMenuItem
      className="gap-2"
      onClick={() =>
        setOpen(
          <CustomModal title={"Edit category"}>
            <CategoriesForm categories={null} />
          </CustomModal>
        )
      }
    >
      <Edit2 size={18} /> Edit
    </DropdownMenuItem>
  );
}
