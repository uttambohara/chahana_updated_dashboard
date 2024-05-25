import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories } from "@/lib/supabase-query";
import AddNewCategory from "./_components/add-new-category";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function CategoryPage() {
  const { categories, error } = await getAllCategories();

  if (error) {
    throw new Error(JSON.stringify(error));
  }

  if (!categories) return <div>No categories found!</div>;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="text-xl">Category</CardTitle>
          <AddNewCategory />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
