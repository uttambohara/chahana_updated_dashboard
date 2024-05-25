"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useModal } from "@/providers/modal-provider";
import { DialogTitle } from "@radix-ui/react-dialog";
import React, { ComponentPropsWithoutRef } from "react";

type Props = {
  title: string;
  subheading?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
} & ComponentPropsWithoutRef<"div">;

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  title,
  ...others
}: Props) => {
  const { className } = others;
  const { isOpen, setClose } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent className={cn("bg-card", className)}>
        <DialogHeader className="pb-3">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
