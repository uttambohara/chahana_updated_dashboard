import { AdminNavList, VendorNavList } from "@/lib/constant/NavBarConstant";
import { MountainIcon } from "lucide-react";
import Link from "next/link";
import CollapsibleNav from "./CollapsibleNav";
import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";
import NavListItem from "./NavListItem";

export default async function NavSidebar() {
  const { data: user } = await getUser();

  if (!user) redirect("/auth/login");

  let NavList: any[] = [];
  if (user.role === "ADMIN") NavList = AdminNavList;
  if (user.role === "VENDOR") NavList = VendorNavList;

  return (
    <div className="hidden lg:block lg:w-[270px] border border-zinc-100  h-full">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
      </div>

      <NavListItem NavList={NavList} />
    </div>
  );
}
