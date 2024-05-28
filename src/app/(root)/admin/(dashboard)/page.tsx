import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import getUser, {
  getAllCategories,
  getAllColors,
  getAllInvoices,
  getAllOrdersForAdminDashboard,
  getAllProductsForAdminDashboard,
  getAllSubCategories,
  getAllUsersForAdminDashboard,
} from "@/lib/supabase-query";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../../vendor/_utils/revenue-calculation";
import BarChartPayment from "./components/bar-chart-payment";
import { redirect } from "next/navigation";

export default async function Admin() {
  // Should use promise.all
  const category = await getAllCategories();
  const subCategory = await getAllSubCategories();
  const colors = await getAllColors();
  const productsResponse = await getAllProductsForAdminDashboard();
  const ordersResponse = await getAllOrdersForAdminDashboard();
  const invoiceResponse = await getAllInvoices();
  const usersResponse = await getAllUsersForAdminDashboard();

  const allCategoryLength = category.categories?.length;
  const allSubCategoryLength = subCategory.subCategories?.length;
  const allColorsLength = colors.colors?.length;
  const allProductsLength = productsResponse.products?.length;

  // Products
  const published = productsResponse.products?.filter(
    (product) => product.status === "Published"
  ).length;
  const draft = productsResponse.products?.filter(
    (product) => product.status === "Draft"
  ).length;

  // Users
  const admins = usersResponse.users?.filter(
    (users) => users.role === "ADMIN"
  ).length;
  const vendors = usersResponse.users?.filter(
    (users) => users.role === "VENDOR"
  ).length;
  const customer = usersResponse.users?.filter(
    (users) => users.role === "CUSTOMER"
  ).length;

  // Orders
  const pending = ordersResponse.orders?.filter(
    (order) => order.status === "PENDING"
  ).length;
  const completed = ordersResponse.orders?.filter(
    (order) => order.status === "COMPLETED"
  ).length;
  const canceled = ordersResponse.orders?.filter(
    (order) => order.status === "CANCELED"
  ).length;
  const refunded = ordersResponse.orders?.filter(
    (order) => order.status === "REFUNDED"
  ).length;

  // Invoice
  const totalAmount = invoiceResponse.invoices?.reduce((acc, invoice) => {
    if (
      invoice.order?.status === "REFUNDED" ||
      invoice.order?.status === "CANCELED"
    )
      return acc;

    const order_product = invoice.order?.order_product;
    const revenueTotal = calculateRevenueTotal(order_product!);
    const { totalAmount } = calculateSummary(revenueTotal);
    return acc + totalAmount;
  }, 0);

  // ... Payment
  const totalPaid = invoiceResponse.invoices?.reduce((acc, invoice) => {
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

  const totalPaidCount = invoiceResponse.invoices?.filter(
    (invoice) => invoice.payment.length > 0
  ).length;

  // ...
  const totalDueAmount = invoiceResponse.invoices?.reduce((acc, invoice) => {
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
  }, 0);
  const totalDueCount = invoiceResponse.invoices?.filter((invoice) => {
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
  const totalPendingAmount = invoiceResponse.invoices?.reduce(
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
  const totalPendingCount = invoiceResponse.invoices?.filter((invoice) => {
    const pendingPayments = invoice.payment.filter(
      (payment) => payment.status === "PENDING"
    );
    return pendingPayments.length > 0;
  }).length;

  //
  const overDueInvoices = invoiceResponse.invoices?.filter(
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
      length: invoiceResponse.invoices?.length,
    }, // total
    { type: "Paid", total: totalPaid, length: totalPaidCount },
    { type: "Pending", total: totalPendingAmount, length: totalPendingCount },
    { type: "Due", total: totalDueAmount, length: totalDueCount },
    // {
    //   type: "overdue",
    //   total: totalOverDueAmount,
    //   length: overDueInvoices?.length,
    // },
  ];

  return (
    <div className="container mx-auto mt-10 min-h-screen">
      <div className="flex gap-8 flex-col">
        <Card className="grid grid-cols-3 py-12 px-8  gap-12 w-full  bg-gradient-to-r from-slate-900 to-slate-700 text-white">
          {/*  */}
          <div className="flex py-2 gap-6">
            <div>
              <p className="text-3xl">{productsResponse.products?.length}</p>
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
              <p className="text-3xl">{usersResponse.users?.length}</p>
              <div>Users</div>
            </div>
            <div>
              <div className="text-sm space-y-2">
                <p>
                  {admins}{" "}
                  <span className="text-zinc-400">
                    {" "}
                    {admins! > 1 ? "admins" : "admin"}
                  </span>
                </p>
                <p>
                  {vendors}{" "}
                  <span className="text-zinc-400">
                    {admins! > 1 ? "vendors" : "vendor"}
                  </span>
                </p>
                <p>
                  {customer}{" "}
                  <span className="text-zinc-400">
                    {" "}
                    {customer! > 1 ? "customers" : "customer"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex py-2 gap-6">
            <div>
              <p className="text-3xl">{ordersResponse.orders?.length}</p>
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
        </Card>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="mb-2">Payments</CardTitle>
            </CardHeader>

            <CardContent className="flex items-center h-[16rem]">
              <BarChartPayment data={showCards} />
            </CardContent>
          </Card>
        </div>

        {/* <div className="flex items-center gap-4">
          <Card className="pt-6">
            <CardContent>
              <span className="text-3xl text-muted-foreground">
                {" "}
                {allCategoryLength}{" "}
              </span>
              <span className="text-sm">categories</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <span className="text-3xl text-muted-foreground">
                {" "}
                {allSubCategoryLength}{" "}
              </span>
              <span className="text-sm">sub-categories</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <span className="text-3xl text-muted-foreground">
                {" "}
                {allColorsLength}{" "}
              </span>
              <span className="text-sm">colors</span>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
}
