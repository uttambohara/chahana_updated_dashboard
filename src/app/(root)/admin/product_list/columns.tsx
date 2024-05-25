"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import { TProductWithCategorySubColorAndSizes } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import TableProductAction from "./_components/TableProductAction";

export type Products = TProductWithCategorySubColorAndSizes;

export const columns: ColumnDef<Products>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const rowWhichIsProduct = row.original;
      const selectTheFirstImageFromImageUrlStringLikeArray = JSON.parse(
        rowWhichIsProduct.productImgs
      )[0].image;
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 relative">
            <Image
              src={selectTheFirstImageFromImageUrlStringLikeArray}
              alt={rowWhichIsProduct.name}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>{rowWhichIsProduct.name}</div>
        </div>
      );
    },
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const rowWhichIsProduct = row.original;
      return (
        <div className="text-muted-foreground">
          {rowWhichIsProduct.category?.name} |{" "}
          {rowWhichIsProduct.sub_category?.name}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const rowWhichIsProduct = row.original;
      const isPublished =
        rowWhichIsProduct.status.toLocaleLowerCase() === "published";
      const isDraft = rowWhichIsProduct.status.toLocaleLowerCase() === "draft";
      return (
        <div className="flex gap-1 items-center">
          {isPublished && <div className="size-2 rounded-full bg-green-600" />}
          {isDraft && <div className="size-2 rounded-full bg-gray-400" />}
          <p>{rowWhichIsProduct.status}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Inventory",
    cell: ({ row }) => {
      const rowWhichIsProduct = row.original;
      const totalQuantity = rowWhichIsProduct.product_size
        .filter((p) => p.product_id === rowWhichIsProduct.id)
        .reduce((acc, item) => acc + item.quantity!, 0);

      return (
        <div className="text-muted-foreground">{totalQuantity} in stock</div>
      );
    },
  },
  {
    accessorKey: "salesPrice",
    header: "Price",
    cell: ({ row }) => {
      const rowWhichIsProduct = row.original;
      return <div>{formatCurrencyToNPR(rowWhichIsProduct.salesPrice)}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowWhichIsProduct = row.original;
      return <TableProductAction rowWhichIsProduct={rowWhichIsProduct} />;
    },
  },
];
