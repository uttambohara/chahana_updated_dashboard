import { Card, CardContent } from "@/components/ui/card";
import { getProductById } from "@/lib/supabase-query";
import Link from "next/link";
import { notFound } from "next/navigation";
import CreateNewProduct from "../../_components/CreateNewProduct";
import CreateProduct from "../../_components/CreateUpdateProduct";
import { VENDOR_PRODUCT_PARAM } from "@/lib/constant";

export default async function UpdateProduct({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  const { product, error } = await getProductById(productId);

  if (error) {
    return JSON.stringify(error);
  }

  return (
    <div className="max-w-[1100px] mx-auto py-10 space-y-4">
      <div>
        <div className="mb-3">
          <Link
            href={`${VENDOR_PRODUCT_PARAM}`}
            className="font-semibold text-sm text-muted-foreground ml-3 hover:text-black"
          >
            &larr; Back to products
          </Link>
        </div>

        <Card>
          <CardContent>
            <CreateProduct productBasedOnParamId={product} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
