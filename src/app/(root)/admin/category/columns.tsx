"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableDeleteButton from "@/components/ui/table/table-delete-button";
import dayMonthYearFormat from "@/lib/utils/format-date";
import { Tables } from "@/types/supabase";
import Image from "next/image";
import EditCategory from "./_components/edit-category";

export type Category = Tables<"category"> & { product: Tables<"product">[] };

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "image_url",
    header: "Image",
    cell: ({ row }) => {
      const rowDataWhichisCategory = row.original;
      const selectTheFirstImageFromImageUrlStringLikeArray = JSON.parse(
        rowDataWhichisCategory.image_url
      )[0].image;
      return (
        <div className="h-8 w-8 relative">
          <Image
            src={selectTheFirstImageFromImageUrlStringLikeArray}
            alt={rowDataWhichisCategory.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="pl-1 text-sm font-medium"
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          className="pl-1 text-sm font-medium"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rowDataWhichisCategory = row.original;
      return (
        <div className="text-muted-foreground">
          {dayMonthYearFormat(rowDataWhichisCategory.created_at)}
        </div>
      );
    },
  },
  {
    id: "products",
    header: "Products",
    cell: ({ row }) => {
      const rowDataWhichisCategory = row.original;
      return (
        <div className="text-center">
          {rowDataWhichisCategory.product.length}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowDataWhichisCategory = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <EditCategory category={row.original} />
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2">
              <TableDeleteButton
                deleteBy="category"
                id={rowDataWhichisCategory.id}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
