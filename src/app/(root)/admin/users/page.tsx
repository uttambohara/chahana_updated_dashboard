import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { DateRangePicker } from "@/components/DateRangePicker";
import { TableFooterPagination } from "@/components/ui/table/table-footer-pagination";
import TableSearchInput from "@/components/ui/table/table-search-input";
import { USERS_PARAM_BASIC } from "@/lib/constant";
import { SearchParams } from "@/types";
import { toast } from "sonner";
import RegisterNewUser from "./_components/RegisterNewUser";
import { getAllUser } from "./_lib/queries";
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
  const { allUsers, users, totalCount, error } = await getAllUser({
    ...search,
    start,
    end,
  });

  if (error) toast.error(JSON.stringify(error));

  // Filter users based on the search title (client side)
  let filteredUsers;
  if (search.title) {
    filteredUsers = allUsers?.filter((user) => {
      const searchTerm = search.title || "";
      return (
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    });
  } else {
    filteredUsers = users; // Example: Show all users
  }

  if (!filteredUsers) return "User not found!";

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="text-xl">Users</CardTitle>
          <RegisterNewUser />
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
            <TableSearchInput filterBy={""} urlPathParam={USERS_PARAM_BASIC} />
          </div>

          <DataTable columns={columns} data={filteredUsers} />

          <TableFooterPagination
            totalLength={totalCount!}
            hasPreviousPage={start > 0}
            hasNextPage={end < totalCount!}
            urlPathParam={USERS_PARAM_BASIC}
          />
        </CardContent>
      </Card>
    </div>
  );
}
