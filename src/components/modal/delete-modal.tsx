"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import LoaderEl from "@/components/LoaderEl";
import { Database } from "@/types/supabase";
import clsx from "clsx";
import { Trash } from "lucide-react";

interface DeleteModalProps {
  deleteBy: keyof Database["public"]["Tables"];
  isPending: boolean;
  deleteFn: () => void;
  hasDelText?: boolean;
  size?: "sm" | "md";
}

export default function DeleteModal({
  deleteBy,
  deleteFn,
  isPending,
  hasDelText = true,
  size,
}: DeleteModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          className={clsx(
            "flex items-center text-red-600/80 cursor-pointer w-fit gap-2",
            {
              "bg-white p-1 rounded-md": !hasDelText,
              "text-xs font-semibold": size === "sm",
            }
          )}
        >
          {isPending && <LoaderEl />}
          {!isPending && <Trash size={18} />}
          {!isPending && hasDelText && "Delete"}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {deleteBy}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            item?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteFn} className="bg-destructive">
            Yes, confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
