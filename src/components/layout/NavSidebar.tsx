import { AdminNavList, VendorNavList } from "@/lib/constant/NavBarConstant";
import { MountainIcon } from "lucide-react";
import Link from "next/link";
import CollapsibleNav from "./CollapsibleNav";
import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";

export default async function NavSidebar() {
  const { data: user } = await getUser();

  if (!user) redirect("/auth/login");

  let NavList: any[] = [];
  if (user.role === "ADMIN") NavList = AdminNavList;
  if (user.role === "VENDOR") NavList = VendorNavList;

  return (
    <div className="hidden lg:block lg:w-[280px] border border-zinc-100 h-screen shadow-sm">
      <div className="flex h-[60px] items-center border-b px-6">
        <Link className="flex items-center gap-2 font-semibold" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
        </Link>
      </div>

      <nav className="grid items-start px-4 py-6 text-sm">
        {NavList.map((listItem) => {
          //...
          // If sublist has items
          if (listItem.subList.length > 0) {
            return <CollapsibleNav listItem={listItem} key={listItem.id} />;
          }

          // otherwise,
          return (
            <Link
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-gray-900"
              href={listItem.link}
              key={listItem.id}
            >
              {listItem.icon}
              {listItem.item}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
