"use client";

import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import dayMonthYearFormat from "@/lib/utils/format-date";
import onlyTimeFormat from "@/lib/utils/format-only-time";
import Image from "next/image";

import { TableCell, TableRow } from "@/components/ui/table";
import FullfillmentIcon from "../../../_components/FulfillmentIcon";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../../../_utils/revenue-calculation";
import { Tables } from "@/types/supabase";
import { useRouter } from "next/navigation";
import { VENDOR_ORDER_PARAM } from "@/lib/constant";

interface TableRowCustomerProps {
  order: Tables<"order"> & { product: Tables<"product">[] } & {
    payment: Tables<"payment">[];
  } & { order_product: Tables<"order_product">[] };
}

export default function TableRowCustomer({ order }: TableRowCustomerProps) {
  const router = useRouter();
  const revenueTotal = calculateRevenueTotal(order.order_product);
  const {
    shippingCharge: SHIPPING_CHARGE,
    GLOBAL_DISCOUNT,
    tax,
    totalAmount,
  } = calculateSummary(revenueTotal);

  const paymentMethods = order.payment?.filter(
    (payment) => payment.order_id === order.id
  );
  if (!paymentMethods) return null;
  const totalPaid = paymentMethods?.reduce(
    (acc, payment) => acc + payment.amount,
    0
  );

  const hasBeenRefundedOrCanceled =
    order.status === "REFUNDED" || order.status === "CANCELED";

  const productImage = JSON.parse(order.product[0].productImgs)[0].image;
  const productName = JSON.parse(order.product[0].productImgs)[0].name;

  return (
    <TableRow
      className="cursor-pointer"
      key={order.id}
      onClick={() => router.push(`${VENDOR_ORDER_PARAM}/${order.id}`)}
    >
      <TableCell className="text-zinc-400">{order.id}</TableCell>
      <TableCell>
        <div className="size-8 relative flex gap-2">
          <Image
            src={productImage}
            alt={productName}
            fill
            priority
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {dayMonthYearFormat(order.created_at)}{" "}
        {onlyTimeFormat(order.created_at)}
      </TableCell>

      <TableCell className="text-muted-foreground">
        <FullfillmentIcon status={order.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
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
      </TableCell>

      <TableCell>{formatCurrencyToNPR(totalAmount)}</TableCell>
    </TableRow>
  );
}
