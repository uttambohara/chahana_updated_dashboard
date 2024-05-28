import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getUser, {
  getCustomerByVendorId,
  getInvoiceByVendorId,
  getOrderByVendorId,
  getProductByIdVendorId,
} from "@/lib/supabase-query";

import { redirect } from "next/navigation";
import BarChartPayments from "../../admin/(dashboard)/components/bar-chart-payment";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../_utils/revenue-calculation";

export default async function Vendor() {
  const { data: user } = await getUser();
  if (!user) redirect("/auth/login");

  // Should use Promise.all
  const vendorBasedOrder = await getOrderByVendorId(user.id);
  const vendorBasedProduct = await getProductByIdVendorId(user.id);
  const InvoicesCreteadByVendors = await getInvoiceByVendorId(user.id);
  const customerByVendorId = await getCustomerByVendorId(user.id);

  // Products
  const published = vendorBasedProduct.product?.filter(
    (product) => product.status === "Published"
  ).length;
  const draft = vendorBasedProduct.product?.filter(
    (product) => product.status === "Draft"
  ).length;

  // Orders
  const pending = vendorBasedOrder.order?.filter(
    (order) => order.status === "PENDING"
  ).length;
  const completed = vendorBasedOrder.order?.filter(
    (order) => order.status === "COMPLETED"
  ).length;
  const canceled = vendorBasedOrder.order?.filter(
    (order) => order.status === "CANCELED"
  ).length;
  const refunded = vendorBasedOrder.order?.filter(
    (order) => order.status === "REFUNDED"
  ).length;

  // Invoice
  const totalAmount = InvoicesCreteadByVendors.invoice?.reduce(
    (acc, invoice) => {
      if (
        invoice.order?.status === "REFUNDED" ||
        invoice.order?.status === "CANCELED"
      )
        return acc;

      const order_product = invoice.order?.order_product;
      const revenueTotal = calculateRevenueTotal(order_product!);
      const { totalAmount } = calculateSummary(revenueTotal);
      return acc + totalAmount;
    },
    0
  );

  // ... Payment
  const totalPaid = InvoicesCreteadByVendors.invoice?.reduce((acc, invoice) => {
    // Payment canceled
    const canceledPaymentFromBank = invoice.payment.filter(
      (payment) => payment.status === "CANCELED"
    );
    const totalCanceledAmount = canceledPaymentFromBank.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    if (
      invoice.order?.status === "REFUNDED" ||
      invoice.order?.status === "CANCELED"
    )
      return acc;
    // paid accumulated
    const accPaid = invoice.payment.reduce((acc, payment) => {
      if (payment.status === "PENDING") {
        return acc;
      }
      return acc + payment.amount;
    }, 0);
    return acc + accPaid - totalCanceledAmount;
  }, 0);

  const totalPaidCount = InvoicesCreteadByVendors.invoice?.filter(
    (invoice) => invoice.payment.length > 0
  ).length;

  // ...
  const totalDueAmount = InvoicesCreteadByVendors.invoice?.reduce(
    (acc, invoice) => {
      if (
        invoice.order?.status === "REFUNDED" ||
        invoice.order?.status === "CANCELED"
      )
        return acc;

      // Payment canceled
      const canceledPaymentFromBank = invoice.payment.filter(
        (payment) => payment.status === "CANCELED"
      );
      const totalCanceledAmount = canceledPaymentFromBank.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );

      // paid accumulated
      const accPaid = invoice.payment.reduce((acc, payment) => {
        return acc + payment.amount;
      }, 0);
      const order_product = invoice.order?.order_product;
      const revenueTotal = calculateRevenueTotal(order_product!);
      const { totalAmount } = calculateSummary(revenueTotal);
      const totalDue = totalAmount - accPaid + totalCanceledAmount;
      return acc + totalDue;
    },
    0
  );
  const totalDueCount = InvoicesCreteadByVendors.invoice?.filter((invoice) => {
    const accPaid = invoice.payment.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const order_product = invoice.order?.order_product;
    const revenueTotal = calculateRevenueTotal(order_product!);
    const { totalAmount } = calculateSummary(revenueTotal);
    const totalDue = totalAmount - accPaid;
    return totalDue > 0;
  }).length;

  // ...
  const totalPendingAmount = InvoicesCreteadByVendors.invoice?.reduce(
    (acc, invoice) => {
      const pendingPayments = invoice.payment.filter(
        (payment) => payment.status === "PENDING"
      );
      const pendingAmount = pendingPayments.reduce(
        (acc, invoice) => invoice.amount + acc,
        0
      );
      return acc + pendingAmount;
    },
    0
  );
  const totalPendingCount = InvoicesCreteadByVendors.invoice?.filter(
    (invoice) => {
      const pendingPayments = invoice.payment.filter(
        (payment) => payment.status === "PENDING"
      );
      return pendingPayments.length > 0;
    }
  ).length;

  //
  const overDueInvoices = InvoicesCreteadByVendors.invoice?.filter(
    (invoice) => invoice.dueDate && new Date(invoice.dueDate) < new Date()
  );
  const totalOverDueAmount = overDueInvoices?.reduce((acc, invoice) => {
    // paid accumulated
    const accPaid = invoice.payment.reduce((acc, payment) => {
      return acc + payment.amount;
    }, 0);
    const order_product = invoice.order?.order_product;
    const revenueTotal = calculateRevenueTotal(order_product!);
    const { totalAmount } = calculateSummary(revenueTotal);
    const totalDue = totalAmount - accPaid;
    return acc + totalDue;
  }, 0);

  const showCards = [
    {
      type: "Total",
      total: totalAmount,
      length: InvoicesCreteadByVendors.invoice?.length,
    }, // total
    { type: "Paid", total: totalPaid, length: totalPaidCount },
    { type: "Pending", total: totalPendingAmount, length: totalPendingCount },
    { type: "Due", total: totalDueAmount, length: totalDueCount },
    {
      type: "Overdue",
      total: totalOverDueAmount,
      length: overDueInvoices?.length,
    },
  ];

  return (
    <div className="container mx-auto mt-10 min-h-screen">
      <div className="flex gap-8 flex-col">
        <Card className="grid grid-cols-3 py-12 px-8  gap-12 w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          {/*  */}
          <div className="flex py-2 gap-6">
            <div>
              <p className="text-3xl">{vendorBasedProduct.product?.length}</p>
              <div>Products</div>
            </div>
            <div>
              <div className="text-sm space-y-2">
                <p>
                  {published} <span className="text-zinc-400">published</span>
                </p>
                <p>
                  {draft} <span className="text-zinc-400">draft</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex py-2 gap-6">
            <div>
              <p className="text-3xl">{vendorBasedOrder.order?.length}</p>
              <div>Orders</div>
            </div>
            <div>
              <div className="text-sm space-y-2">
                <p>
                  {pending} <span className="text-zinc-400">pending</span>
                </p>
                <p>
                  {completed} <span className="text-zinc-400">completed</span>
                </p>
                <p>
                  {canceled} <span className="text-zinc-400">canceled</span>
                </p>
                <p>
                  {refunded} <span className="text-zinc-400">refunded</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex py-2 gap-6">
            <div>
              <p className="text-3xl">{customerByVendorId.customer?.length}</p>
              <div>Customers</div>
            </div>
            <div>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-zinc-400">
                    {customerByVendorId.customer?.length === 0 && "0"}
                    {customerByVendorId.customer?.[0]?.order.length} orders
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="mb-2">Payments</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center h-[16rem]">
            <BarChartPayments data={showCards} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
