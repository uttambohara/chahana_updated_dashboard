"use client";

import { DataTableColumnHeader } from "@/components/ui/table/data-table-column-headers";
import { USERS_PARAM_BASIC } from "@/lib/constant";
import dayMonthYearFormat from "@/lib/utils/format-date";
import { Tables } from "@/types/supabase";
import { ColumnDef } from "@tanstack/react-table";
import ChangeRoleAction from "./_components/ChangeRoleAction";
import UserRoleIcon from "./_components/UserRoleIcons";
import Image from "next/image";

export type Users = Tables<"users">;

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Joined At"}
          urlPathParameterExcludingBaseUrl={USERS_PARAM_BASIC}
        />
      );
    },
    cell: ({ row }) => {
      const rowWhichIsUser = row.original;
      return (
        <div className="text-muted-foreground">
          {dayMonthYearFormat(rowWhichIsUser.created_at!)}
        </div>
      );
    },
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Name"}
          urlPathParameterExcludingBaseUrl={USERS_PARAM_BASIC}
        />
      );
    },
    cell: ({ row }) => {
      const rowWhichIsUser = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="relative size-8">
            <Image
              src={rowWhichIsUser.avatar_url as string}
              alt={rowWhichIsUser.first_name}
              fill
              priority
              className="rounded-full object-cover"
            />
          </div>

          <div className="flex gap-2">
            <p>
              {rowWhichIsUser.first_name} {rowWhichIsUser.last_name}
            </p>
            <p className="text-zinc-400">{rowWhichIsUser.email}</p>
          </div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "email",
  //   header: ({ column }) => {
  //     return (
  //       <DataTableColumnHeader
  //         column={column}
  //         title={"Email"}
  //         urlPathParameterExcludingBaseUrl={USERS_PARAM_BASIC}
  //       />
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const rowWhichIsUser = row.original;
  //     return <p className="text-muted-foreground">{rowWhichIsUser.email}</p>;
  //   },
  // },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => {
      const rowWhichIsUser = row.original;
      return <p className="text-muted-foreground">{rowWhichIsUser.phone}</p>;
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={"Role"}
          urlPathParameterExcludingBaseUrl={USERS_PARAM_BASIC}
        />
      );
    },
    cell: ({ row }) => {
      const rowWhichIsUser = row.original;
      return <UserRoleIcon role={rowWhichIsUser.role} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowWhichIsUser = row.original;
      return (
        <ChangeRoleAction
          rowWhichIsUser={rowWhichIsUser}
          userId={rowWhichIsUser.id}
        />
      );
    },
  },
];
