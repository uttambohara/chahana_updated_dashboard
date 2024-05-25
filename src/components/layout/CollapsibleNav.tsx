import { ChevronDownIcon, Package } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

interface CollapsibleNav {
  listItem: {
    id: number;
    item: string;
    link: string;
    icon: React.JSX.Element;
    subList: {
      id: number;
      item: string;
      link: string;
    }[];
  };
}

export default function CollapsibleNav({ listItem }: CollapsibleNav) {
  return (
    <Collapsible className="space-y-1">
      <CollapsibleTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 w-full">
        <Package />
        {listItem.item}
        <ChevronDownIcon className="ml-auto h-4 w-4 transition-transform group-[data-state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 space-y-1">
        {listItem.subList.map((sub) => (
          <Link
            key={sub.id}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            href={sub.link}
          >
            {sub.item}
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
