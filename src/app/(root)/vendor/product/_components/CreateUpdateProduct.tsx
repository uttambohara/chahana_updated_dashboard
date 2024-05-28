import { TProductWithCategorySubCategoryWithColorWithSizes } from "@/types";

import getUser, {
  getAllCategories,
  getAllColors,
  getAllSizes,
  getAllSubCategories,
} from "@/lib/supabase-query";
import { redirect } from "next/navigation";
import CreateNewProduct from "./CreateNewProduct";
import UpdateExistingProduct from "./UpdateExistingProduct";

interface ProductProps {
  productBasedOnParamId?: TProductWithCategorySubCategoryWithColorWithSizes;
}

export default async function CreateUpdateProduct({
  productBasedOnParamId,
}: ProductProps) {
  const { data: user } = await getUser();

  if (!user) return redirect("/auth/login");

  const sizesPromise = getAllSizes();
  const colorPromsie = getAllColors();
  const categoriesPromise = getAllCategories();
  const subCategoriesPromise = getAllSubCategories();

  const [
    categoriesResponse,
    subCategoriesResponse,
    sizesPromiseResponse,
    colorPromiseResponse,
  ] = await Promise.all([
    categoriesPromise,
    subCategoriesPromise,
    sizesPromise,
    colorPromsie,
  ]);

  const { categories } = categoriesResponse;
  const { subCategories } = subCategoriesResponse;
  const { sizes } = sizesPromiseResponse;
  const { colors } = colorPromiseResponse;

  if (productBasedOnParamId && productBasedOnParamId?.length > 0)
    return (
      <UpdateExistingProduct
        productBasedOnParamId={productBasedOnParamId}
        userId={user.id}
        categories={categories}
        subCategories={subCategories}
        sizes={sizes}
        colors={colors}
      />
    );

  return (
    <CreateNewProduct
      productBasedOnParamId={productBasedOnParamId}
      userId={user.id}
      categories={categories}
      subCategories={subCategories}
      sizes={sizes}
      colors={colors}
    />
  );
}
