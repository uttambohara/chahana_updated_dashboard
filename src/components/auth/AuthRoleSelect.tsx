import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ControllerRenderProps } from "react-hook-form";
import AuthRoleSelectItem from "./AuthRoleSelectItem";
import { UserRole } from "@/types/form-schemas";
import { userRole } from "@/lib/constant";

interface AuthRoleSelectProps {
  field: ControllerRenderProps<
    {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone: string;
      address: string;
      role: UserRole;
    },
    "role"
  >;
}

export default function AuthRoleSelect({ field }: AuthRoleSelectProps) {
  return (
    <Select onValueChange={field.onChange}>
      <SelectTrigger className="w-[180px] text-zinc-500">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        {["VENDOR", "CUSTOMER"].map((role) => (
          <AuthRoleSelectItem key={role} role={role} />
        ))}
      </SelectContent>
    </Select>
  );
}
