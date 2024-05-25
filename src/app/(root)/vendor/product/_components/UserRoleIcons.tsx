import clsx from "clsx";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface UserRoleIconProps {
  role: string;
}

export default function UserRoleIcon({ role }: UserRoleIconProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 w-[6rem] rounded-full font-bold p-1 text-xs",
        {
          "text-yellow-700 bg-yellow-50": role === "CUSTOMER",
          "text-green-700 bg-green-50": role === "VENDOR",
          "text-red-700 bg-red-50": role === "ADMIN",
        }
      )}
    >
      {role === "CUSTOMER" && <Shield size={16} />}
      {role === "VENDOR" && <ShieldCheck size={16} />}
      {role === "ADMIN" && <ShieldAlert size={16} />}
      {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
    </div>
  );
}
