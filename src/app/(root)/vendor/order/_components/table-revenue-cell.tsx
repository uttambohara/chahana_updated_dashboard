import { SHIPPING_CHARGE } from "@/lib/constant";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import { OrderWithCustomer } from "@/types";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../../_utils/revenue-calculation";

interface TableRevenueCellProps {
  rowDataWhichIsOrder: OrderWithCustomer;
}

export default function TableRevenueCell({
  rowDataWhichIsOrder,
}: TableRevenueCellProps) {
  const revenueTotal = calculateRevenueTotal(rowDataWhichIsOrder.order_product);
  const {
    shippingCharge: SHIPPING_CHARGE,
    GLOBAL_DISCOUNT,
    tax,
    totalAmount,
  } = calculateSummary(revenueTotal);

  const paymentMethods = rowDataWhichIsOrder.payment?.filter(
    (payment) => payment.order_id === rowDataWhichIsOrder.id
  );
  if (!paymentMethods) return null;

  return (
    <div className="flex items-center gap-2">
      <div>{formatCurrencyToNPR(totalAmount)}</div>
    </div>
  );
}
