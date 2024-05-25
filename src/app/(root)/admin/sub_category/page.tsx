import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCategories, getAllSubCategories } from "@/lib/supabase-query";
import AddNewSubCategory from "./_components/add-new-sub_category";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function CategoryPage() {
  const categories = getAllCategories();
  const subCategories = getAllSubCategories();

  const [categoriesResponse, subCategoriesResponse] = await Promise.all([
    categories,
    subCategories,
  ]);

  const categoriesData = categoriesResponse.categories;
  const subCategoriesData = subCategoriesResponse.subCategories;

  if (categoriesResponse.error || subCategoriesResponse.error) {
    throw new Error(
      JSON.stringify(categoriesResponse.error || subCategoriesResponse.error)
    );
  }

  if (!categoriesData || !subCategoriesData)
    return <div>No sub-categories found!</div>;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="text-xl">Sub Category</CardTitle>
          <AddNewSubCategory categories={categoriesData} />
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={subCategoriesData} />
        </CardContent>
      </Card>
    </div>
  );
}
