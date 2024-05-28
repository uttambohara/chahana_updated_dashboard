"use client";

import Link from "next/link";
import CollapsibleNav from "./CollapsibleNav";
import { NavListType } from "@/lib/constant/NavBarConstant";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import clsx from "clsx";

interface NavListItemProps {
  NavList: NavListType;
}

export default function NavListItem({ NavList }: NavListItemProps) {
  const pathname = usePathname();

  return (
    <nav className="px-4 py-6 text-sm h-full">
      {NavList.map((listItem) => {
        const isActive = listItem.link === pathname;

        //...
        // If sublist has items
        if (listItem.subList.length > 0) {
          return <CollapsibleNav listItem={listItem} key={listItem.id} />;
        }

        // otherwise,
        return (
          <Link
            className={clsx(
              "flex items-center gap-3 rounded-lg p-2.5 text-muted-foreground transition-all hover:text-gray-900",
              {
                "bg-zinc-100": isActive,
              }
            )}
            href={listItem.link}
            key={listItem.id}
          >
            {listItem.icon}
            {listItem.item}
          </Link>
        );
      })}
    </nav>
  );
}
