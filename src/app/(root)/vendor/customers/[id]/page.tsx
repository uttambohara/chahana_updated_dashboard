import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENDOR_CUSTOMERS_PARAM } from "@/lib/constant";
import { getCustomerById } from "@/lib/supabase-query";
import Image from "next/image";
import Link from "next/link";
import {
  calculateRevenueTotal,
  calculateSummary,
} from "../../_utils/revenue-calculation";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableRowCustomer from "./_components/TableRowCustomer";

export default async function IndividualUser({
  params,
}: {
  params: { id: string };
}) {
  const customerId = Number(params.id);

  const { customer, error } = await getCustomerById(customerId);

  if (error) {
    return JSON.stringify(error);
  }

  const customerToDisplay = customer?.[0];

  return (
    <div className="container py-10 space-y-4">
      <div>
        <Link
          href={`${VENDOR_CUSTOMERS_PARAM}`}
          className="font-semibold text-sm text-muted-foreground ml-3 hover:text-black"
        >
          &larr; Back to Customers
        </Link>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <div className="size-32 relative">
                  <Image
                    src={customerToDisplay?.users?.avatar_url as string}
                    alt={customerToDisplay?.users?.first_name as string}
                    fill
                    priority
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-semibold">
                      {customerToDisplay?.users?.first_name}{" "}
                      {customerToDisplay?.users?.last_name}
                    </h2>
                    <p className="text-muted-foreground">
                      | {customerToDisplay?.users?.email}
                    </p>
                    <p> </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {customerToDisplay?.users?.phone}
                  </p>
                  <p className="text-zinc-400 text-sm">
                    {customerToDisplay?.order.length} orders
                  </p>{" "}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15px]"></TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Fulfillment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerToDisplay?.order.map((order) => {
                    return <TableRowCustomer order={order} key={order.id} />;
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
