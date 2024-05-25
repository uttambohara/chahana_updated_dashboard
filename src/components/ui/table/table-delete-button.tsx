"use client";

import { deleteTableBy } from "@/actions/supabase/supabase-db";
import DeleteModal from "@/components/modal/delete-modal";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface TableDeleteButtonProps {
  size?: "sm" | "md";
  hasDelText?: boolean;
  deleteBy: keyof Database["public"]["Tables"];
  id: number | string;
}

export default function TableDeleteButton({
  hasDelText,
  deleteBy,
  id,
  size,
}: TableDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(id: number | string) {
    startTransition(async () => {
      const response = await deleteTableBy(deleteBy, "id", id);
      const { _, error } = JSON.parse(response);
      if (error) {
        toast.error(JSON.stringify(error));
      }

      router.refresh();
    });
  }
  return (
    <DeleteModal
      deleteFn={() => handleDelete(id)}
      isPending={isPending}
      hasDelText={hasDelText}
      deleteBy={deleteBy}
      size={size}
    />
  );
}
