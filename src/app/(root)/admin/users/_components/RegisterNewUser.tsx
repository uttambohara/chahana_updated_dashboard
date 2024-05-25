"use client";

import CustomModal from "@/components/CustomModal";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/form/RegisterForm";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";
import React from "react";

export default function RegisterNewUser() {
  const { setOpen } = useModal();

  return (
    <Button
      onClick={() =>
        setOpen(
          <CustomModal
            title={"Create account"}
            subheading="Add a new user."
            className="h-[40rem] min-w-[10rem] overflow-scroll"
          >
            <RegisterForm hasSocialLink={false} hasFooterLink={false} />
          </CustomModal>
        )
      }
    >
      <Plus size={18} /> Add new user
    </Button>
  );
}
