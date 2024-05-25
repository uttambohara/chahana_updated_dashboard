import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DateRangePicker } from "@/components/DateRangePicker";
import { TableFooterPagination } from "@/components/ui/table/table-footer-pagination";
import TableSearchInput from "@/components/ui/table/table-search-input";

import { ADMIN_PRODUCT_PARAM } from "@/lib/constant";
import { CreateProductProvider } from "@/providers/create-product-provider";
import { SearchParams } from "@/types";
import CreateProduct from "./_components/CreateUpdateProduct";
import { getAllProducts } from "./_lib/queries";
import { searchParamsSchema } from "./_lib/validations";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export interface UserPageProps {
  searchParams: SearchParams;
}

export default async function UserPage({ searchParams }: UserPageProps) {
  // Parse the search parameters using the validation schema
  const search = searchParamsSchema.parse(searchParams);

  // Calculate the start and end indices for pagination
  const start = (search.page - 1) * search.per_page;
  const end = start + search.per_page - 1;

  // backend
  const { allProducts, products, totalCount, error } = await getAllProducts({
    ...search,
    start,
    end,
  });

  if (error) return JSON.stringify(error);

  // Filter users based on the search title (client side)
  let filteredProducts;
  if (search.title) {
    filteredProducts = allProducts?.filter((product) => {
      const searchTerm = search.title || "";
      return (
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  } else {
    filteredProducts = products; // Example: Show all users
  }

  return (
    <CreateProductProvider>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="flex-row items-center justify-between py-4">
            <CardTitle className="text-xl">Products</CardTitle>
            <CreateProduct />
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
                filterBy={"name, SKU"}
                urlPathParam={ADMIN_PRODUCT_PARAM}
              />
            </div>

            <DataTable columns={columns} data={filteredProducts!} />

            <TableFooterPagination
              totalLength={totalCount!}
              hasPreviousPage={start > 0}
              hasNextPage={end < totalCount!}
              urlPathParam={ADMIN_PRODUCT_PARAM}
            />
          </CardContent>
        </Card>
      </div>
    </CreateProductProvider>
  );
}