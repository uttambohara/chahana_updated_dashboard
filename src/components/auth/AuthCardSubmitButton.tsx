import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface AuthCardSubmitButtonProps {
  authType: "Sign in" | "Sign up";
  isPending: boolean;
}

export default function AuthCardSubmitButton({
  authType,
  isPending,
}: AuthCardSubmitButtonProps) {
  return (
    <Button className="w-full" type="submit" disabled={isPending}>
      {authType}
      {isPending && <Loader className="animate-spin" />}
    </Button>
  );
}
