"use client";

import { Checkbox } from "@/components/ui/checkbox";
import dayMonthYearFormat from "@/lib/utils/format-date";
import { CustomersT } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export type Customers = CustomersT;

export const columns: ColumnDef<Customers>[] = [
  {
    accessorKey: "created_at",
    header: "Date added",
    cell: ({ row }) => {
      const rowWhichIsCustomer = row.original;
      return (
        <div className="text-muted-foreground">
          {dayMonthYearFormat(rowWhichIsCustomer.created_at)}
        </div>
      );
    },
  },
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => {
      const rowWhichIsCustomer = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 relative">
            <Image
              src={rowWhichIsCustomer.users?.avatar_url as string}
              alt={rowWhichIsCustomer.users?.first_name as string}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>
            {rowWhichIsCustomer.users?.first_name}{" "}
            {rowWhichIsCustomer.users?.last_name}
          </div>
        </div>
      );
    },
  },
  {
    id: "email",
    header: "Email",
    cell: ({ row }) => {
      const rowWhichIsCustomer = row.original;
      return (
        <div className="flex items-center gap-2">
          {rowWhichIsCustomer.users?.email}
        </div>
      );
    },
  },
  {
    id: "order",
    header: "Order",
    cell: ({ row }) => {
      const rowWhichIsCustomer = row.original;
      return (
        <div className="text-muted-foreground">
          {rowWhichIsCustomer.order.length}
        </div>
      );
    },
  },
];
