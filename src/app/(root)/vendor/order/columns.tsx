"use client";

import dayMonthYearFormat from "@/lib/utils/format-date";
import { OrderWithCustomer } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../_utils/revenue-calculation";
import TableRevenueCell from "./_components/table-revenue-cell";
import FullfillmentIcon from "../_components/FulfillmentIcon";

export type Orders = OrderWithCustomer;

export const columns: ColumnDef<Orders>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => {
      const rowWhichIsOrder = row.original;
      return <div>{rowWhichIsOrder.id}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const rowWhichIsOrder = row.original;
      return (
        <div className="text-muted-foreground">
          {dayMonthYearFormat(rowWhichIsOrder.created_at)}
        </div>
      );
    },
  },
  {
    accessorKey: "users",
    header: "Customer",
    cell: ({ row }) => {
      const rowWhichIsOrder = row.original;
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 relative">
            <Image
              src={rowWhichIsOrder.customer?.users?.avatar_url as string}
              alt={rowWhichIsOrder.customer?.users?.first_name as string}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div>
            {rowWhichIsOrder.customer?.users?.first_name}{" "}
            {rowWhichIsOrder.customer?.users?.last_name}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Fulfillment",
    cell: ({ row }) => {
      const rowWhichIsOrder = row.original;
      const status = rowWhichIsOrder.status;

      return (
        <div className="text-muted-foreground">
          <FullfillmentIcon status={status} />
        </div>
      );
    },
  },
  {
    id: "paymentStatus",
    header: "Payment status",
    cell: ({ row }) => {
      const rowWhichIsOrder = row.original;
      const revenueTotal = calculateRevenueTotal(rowWhichIsOrder.order_product);
      const { totalAmount } = calculateSummary(revenueTotal);
      const paymentMethods = rowWhichIsOrder.payment?.filter(
        (payment) => payment.order_id === rowWhichIsOrder.id
      );
      if (!paymentMethods) return null;
      const totalPaid = paymentMethods?.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );

      const hasBeenRefundedOrCanceled =
        rowWhichIsOrder.status === "REFUNDED" ||
        rowWhichIsOrder.status === "CANCELED";

      return (
        <div className="flex items-center gap-2">
          {Math.floor(totalPaid) < Math.floor(totalAmount) &&
            !hasBeenRefundedOrCanceled && (
              <div className="size-2 rounded-full bg-red-600" />
            )}
          {Math.floor(totalPaid) === Math.floor(totalAmount) &&
            !hasBeenRefundedOrCanceled && (
              <div className="size-2 rounded-full bg-green-400" />
            )}
          {Math.floor(totalPaid) > Math.floor(totalAmount) &&
            !hasBeenRefundedOrCanceled && (
              <div className="size-2 rounded-full bg-yellow-400" />
            )}

          {hasBeenRefundedOrCanceled && "N/A"}
          {Math.floor(totalPaid) < Math.floor(totalAmount) &&
            !hasBeenRefundedOrCanceled &&
            "Remaining"}
          {Math.floor(totalPaid) >= Math.floor(totalAmount) &&
            !hasBeenRefundedOrCanceled &&
            "Paid"}
        </div>
      );
    },
  },
  {
    id: "revenue",
    header: "Total",
    cell: ({ row }) => {
      const rowWhichIsOrder = row.original;
      return <TableRevenueCell rowDataWhichIsOrder={rowWhichIsOrder} />;
    },
  },
];
