import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TAXES, VENDOR_ORDER_PARAM } from "@/lib/constant";
import { getOrderById } from "@/lib/supabase-query";
import firstLetterCapital from "@/lib/utils/first-letter-capital";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import dayMonthYearFormat from "@/lib/utils/format-date";
import onlyTimeFormat from "@/lib/utils/format-only-time";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../../_utils/revenue-calculation";
import DropDownAction from "../_components/DropdownAction";
import CreateFulfillment from "../_components/create-fulfillment";
import RefundCard from "../_components/refund-card";

export default async function IndividialOrder({
  params,
}: {
  params: { id: string };
}) {
  const orderId = Number(params.id);

  const { order, error } = await getOrderById(orderId);

  if (error) {
    return JSON.stringify(error);
  }

  if (!!!order?.length) notFound();

  const orderToDisplay = order.find((o) => o.id === orderId);
  if (!orderToDisplay) notFound();
  const orderStatus = orderToDisplay.status;

  const product_order = orderToDisplay.order_product[0];
  const orderProduct = orderToDisplay.order_product[0]?.product;
  if (!product_order)
    return (
      <div className="h-screen">
        order_product has not been created! This is created on the frontend as
        soon as the user orders the product.
      </div>
    );
  const orderImage = JSON.parse(orderProduct?.productImgs as string)[0].image;

  //
  const revenueTotal = calculateRevenueTotal(orderToDisplay.order_product);
  const {
    shippingCharge: SHIPPING_CHARGE,
    GLOBAL_DISCOUNT,
    tax,
    totalAmount,
  } = calculateSummary(revenueTotal);

  const paymentMethods = orderToDisplay.payment?.filter(
    (payment) => payment.order_id === orderToDisplay.id
  );
  if (!paymentMethods) return null;
  const totalPaid = paymentMethods?.reduce(
    (acc, payment) => acc + payment.amount,
    0
  );

  const invoiceId = orderToDisplay.invoice.find(
    (inv) => inv.order_id === orderToDisplay.id
  )?.id;

  return (
    <div className="max-w-[1150px] mx-auto py-10 space-y-4">
      <div>
        <Link
          href={`${VENDOR_ORDER_PARAM}`}
          className="font-semibold text-sm text-muted-foreground ml-3 hover:text-black"
        >
          &larr; Back to orders
        </Link>
      </div>

      <div className="grid lg:grid-cols-[60%_1fr] gap-6 grid-cols-1">
        <div className="space-y-6">
          <Card className="pb-12">
            <CardHeader className="flex-row justify-between items-start mb-4">
              <div className="flex flex-row gap-2">
                <CardTitle>#{orderToDisplay.id}</CardTitle>
                <div className="text-[0.9rem] text-zinc-400">
                  |{dayMonthYearFormat(orderToDisplay.created_at)}{" "}
                  {onlyTimeFormat(orderToDisplay.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {orderStatus === "COMPLETED" && (
                  <div className="size-2 rounded-full bg-green-600" />
                )}
                {orderStatus === "PENDING" && (
                  <div className="size-2 rounded-full bg-red-400" />
                )}
                {orderStatus === "CANCELED" && (
                  <div className="size-2 rounded-full bg-red-400" />
                )}
                {orderStatus === "REFUNDED" && (
                  <div className="size-2 rounded-full bg-yellow-400" />
                )}
                {firstLetterCapital(orderStatus)}
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-8">
                <div className="flex flex-start gap-8 flex-wrap">
                  <div className="flex gap-6 items-center">
                    <div className="relative size-24">
                      <Image
                        src={
                          orderToDisplay.customer?.users?.avatar_url as string
                        }
                        alt={
                          orderToDisplay.customer?.users?.first_name as string
                        }
                        fill
                        priority
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="space-y-1 pr-6 border-r">
                      <p>
                        {orderToDisplay.customer?.users?.first_name}{" "}
                        {orderToDisplay.customer?.users?.last_name}
                      </p>
                      <p className="text-muted-foreground">
                        {orderToDisplay.customer?.users?.email}
                      </p>
                      <p className="text-muted-foreground">
                        {orderToDisplay.customer?.users?.address}
                      </p>
                    </div>
                    <p>
                      {orderToDisplay.payment
                        .map((pymt) => ` ${pymt.method}`)
                        .toLocaleString() || "-"}
                      {Math.floor(totalPaid) < Math.floor(totalAmount) && (
                        <span className="text-zinc-400">
                          |Payment remaining
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="space-y-2">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 text-sm">
              <div className="space-y-6">
                <div className="flex justify-between space-y-1 p-3 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <div className="size-8 relative">
                      <Image
                        src={orderImage}
                        alt={orderProduct?.name as string}
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div>{orderProduct?.name}</div>
                    </div>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-6 justify-end">
                    <div className="flex items-center gap-2">
                      <div>
                        {formatCurrencyToNPR(orderProduct?.salesPrice!)}
                      </div>
                      <div>x {product_order?.quantity}</div>
                    </div>
                    <div className="text-black">
                      {formatCurrencyToNPR(
                        orderProduct?.salesPrice! * product_order.quantity
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      Subtotal{" "}
                      {product_order.product?.discount && (
                        <span className="text-zinc-400">
                          /inc. product specific discount ({" "}
                          {product_order.product?.discount}%)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-black">
                      {formatCurrencyToNPR(revenueTotal)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">Shipping</div>
                    <div className="flex items-center gap-6 text-black">
                      {formatCurrencyToNPR(SHIPPING_CHARGE)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      Discount{" "}
                      <span className="text-zinc-400">/global discount</span>
                    </div>
                    <div className="flex items-center gap-6 text-black">
                      {formatCurrencyToNPR(GLOBAL_DISCOUNT)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      Tax <span className="text-zinc-400">/{TAXES}%</span>
                    </div>
                    <div className="flex items-center gap-6 text-black">
                      {formatCurrencyToNPR(tax)}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 font-semibold">
                      Total
                    </div>
                    <div className="flex items-center gap-6 text-black text-[1.2rem] font-semibold">
                      {formatCurrencyToNPR(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="space-y-2">
            <CardHeader className="flex-row justify-between items-start">
              <CardTitle>Payment</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                {Math.floor(totalPaid) < Math.floor(totalAmount) && (
                  <div className="size-2 rounded-full bg-red-600" />
                )}
                {Math.floor(totalPaid) === Math.floor(totalAmount) && (
                  <div className="size-2 rounded-full bg-green-400" />
                )}
                {Math.floor(totalPaid) > Math.floor(totalAmount) && (
                  <div className="size-2 rounded-full bg-yellow-400" />
                )}

                {Math.floor(totalPaid) < Math.floor(totalAmount) && "Remaining"}
                {Math.floor(totalPaid) >= Math.floor(totalAmount) && "Paid"}

                <DropDownAction
                  invoice_id={invoiceId}
                  customer_id={orderToDisplay.customer_id}
                  order_id={orderToDisplay.id}
                  totalAmount={totalAmount}
                  paid={totalPaid}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-8 text-sm">
              <div className="space-y-6">
                <div className="flex space-y-4 rounded-md flex-col">
                  {orderToDisplay.payment.map((pymt) => (
                    <div
                      key={pymt.id}
                      className="flex justify-between w-full items-center"
                    >
                      <div className="flex flex-col gap-1">
                        <div>
                          Pmt #{pymt.id}{" "}
                          <span className="text-sm text-zinc-400">
                            | {dayMonthYearFormat(pymt.created_at)}{" "}
                            {onlyTimeFormat(pymt.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="gap-2 flex">
                        <span className="text-muted-foreground">
                          {firstLetterCapital(pymt.method)}
                        </span>
                        <span>{formatCurrencyToNPR(pymt.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    Total Paid
                  </div>
                  <div className="flex items-center gap-6 text-black text-[1.2rem] font-semibold">
                    {formatCurrencyToNPR(totalPaid)}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 font-semibold">
                    Total remaining
                  </div>
                  <div className="flex items-center gap-6 text-black text-[1.2rem] font-semibold">
                    {formatCurrencyToNPR(
                      Math.floor(totalAmount) - Math.floor(totalPaid)
                    )}
                  </div>
                </div>
                <div className="flex">
                  <div className="ml-auto flex items-center gap-3">
                    <p className="text-zinc-400">If product delivered, </p>
                    <CreateFulfillment
                      orderId={orderToDisplay.id}
                      paidStatus={
                        Math.floor(totalAmount) <= Math.floor(totalPaid)
                      }
                      status={orderToDisplay.status}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <RefundCard
            orderId={orderToDisplay.id}
            status={orderToDisplay.status}
          />
        </div>
      </div>
    </div>
  );
}
