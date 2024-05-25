"use client";

import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";
import CategoriesForm from "./category-form";

export default function AddNewCategory() {
  const { setOpen } = useModal();
  return (
    <Button
      variant={"outline"}
      className="gap-1"
      onClick={() =>
        setOpen(
          <CustomModal title={"Add Category"}>
            <CategoriesForm />
          </CustomModal>
        )
      }
    >
      <Plus size={18} />
      New category
    </Button>
  );
}
