"use client";

import { supabaseLogout } from "@/actions/supabase/supabase-logout";
import { Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      className="flex items-center gap-1"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await supabaseLogout();
          router.push("/auth");
        });
      }}
    >
      <LogOut size={18} />
      Sign out
      {isPending && <Loader className="animate-spin" />}
    </Button>
  );
}
