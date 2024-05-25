import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DateRangePicker } from "@/components/DateRangePicker";
import { TableFooterPagination } from "@/components/ui/table/table-footer-pagination";
import TableSearchInput from "@/components/ui/table/table-search-input";
import { VENDOR_ORDER_PARAM } from "@/lib/constant";
import { CreateProductProvider } from "@/providers/create-product-provider";
import { SearchParams } from "@/types";
import { getAllOrders } from "./_lib/queries";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { searchParamsSchema } from "./_lib/validation";

export interface UserPageProps {
  searchParams: SearchParams;
}

export default async function OrderPage({ searchParams }: UserPageProps) {
  // Parse the search parameters using the validation schema
  const search = searchParamsSchema.parse(searchParams);

  // Calculate the start and end indices for pagination
  const start = (search.page - 1) * search.per_page;
  const end = start + search.per_page - 1;

  // backend
  const { allOrders, orders, totalCount, error } = await getAllOrders({
    ...search,
    start,
    end,
  });

  if (error) return JSON.stringify(error);

  // Filter users based on the search title (client side)
  let filteredOrders;
  if (search.title) {
    filteredOrders = allOrders?.filter((order) => {
      const searchTerm = search.title || "";
      return (
        order.users?.first_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.users?.last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  } else {
    filteredOrders = orders; // Example: Show all orders
  }

  return (
    <CreateProductProvider>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between py-4">
            <CardTitle className="text-xl">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex py-6 flex-col">
              <DateRangePicker
                triggerVariant={"secondary"}
                triggerSize="sm"
                triggerClassName="ml-auto w-56 sm:w-60"
                align="end"
                dateRange={
                  search.from && search.to
                    ? { from: new Date(search.from), to: new Date(search.to) }
                    : undefined
                }
              />
              <TableSearchInput
                filterBy={"customer, status"}
                urlPathParam={VENDOR_ORDER_PARAM}
              />
            </div>

            <DataTable columns={columns} data={filteredOrders!} />

            <TableFooterPagination
              totalLength={totalCount!}
              hasPreviousPage={start > 0}
              hasNextPage={end < totalCount!}
              urlPathParam={VENDOR_ORDER_PARAM}
            />
          </CardContent>
        </Card>
      </div>
    </CreateProductProvider>
  );
}
