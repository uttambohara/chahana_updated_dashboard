import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VENDOR_PRODUCT_PARAM } from "@/lib/constant";
import {
  getProductById,
  getProductByIdWithVariantColorsAndSizes,
} from "@/lib/supabase-query";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function IndividialProduct({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  const { product, error } = await getProductByIdWithVariantColorsAndSizes(
    productId
  );

  if (error) {
    return JSON.stringify(error);
  }

  if (!!!product?.length) notFound();

  const productToDisplay = product?.[0];
  const isPublished = productToDisplay.status.toLowerCase() === "published";
  const isDraft = productToDisplay.status.toLocaleLowerCase() === "draft";

  return (
    <div className="max-w-[1200px] mx-auto py-10 space-y-4">
      <div>
        <Link
          href={`${ADMIN_PRODUCT_PARAM}`}
          className="font-semibold text-sm text-muted-foreground ml-3 hover:text-black"
        >
          &larr; Back to products
        </Link>
      </div>

      <div className="grid lg:grid-cols-[60%_1fr] gap-6 grid-cols-1">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row justify-between">
              <CardTitle>{productToDisplay.name}</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                {isPublished && (
                  <div className="size-2 rounded-full bg-green-600" />
                )}
                {isDraft && <div className="size-2 rounded-full bg-gray-400" />}
                {productToDisplay.status}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h2 className="font-semibold">Details</h2>
                  <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div>Material</div>
                      <div>{productToDisplay.material || "-"}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Discountables</div>
                      <div>
                        {productToDisplay.discountable ? (
                          <div className="text-zinc-400">
                            {productToDisplay.discountable.toString()}
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Category</div>
                      <div>{productToDisplay.category?.name || "-"}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Sub Category</div>
                      <div>{productToDisplay.sub_category?.name || "-"}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold">Pricing</h2>
                  <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div className="font-semibold text-black text-[1.1rem]">
                        {formatCurrencyToNPR(productToDisplay.salesPrice) ||
                          "-"}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Discount</div>
                      <div>{productToDisplay.discount || "-"}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Attributes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h2 className="font-semibold">Dimensions</h2>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>Height</div>
                    <div>
                      {productToDisplay.height
                        ? `${productToDisplay.height} cm`
                        : "-"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Width</div>
                    <div>
                      {productToDisplay.width
                        ? `${productToDisplay.width} cm`
                        : "-"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Length</div>
                    <div>
                      {productToDisplay.length
                        ? `${productToDisplay.length} cm`
                        : "-"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Weight</div>
                    <div>
                      {" "}
                      {productToDisplay.weight
                        ? `${productToDisplay.length} gm`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="h-[25rem]">
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Table className="h-[20rem]">
                  {productToDisplay.variants.length === 0 && (
                    <TableCaption>Empty list</TableCaption>
                  )}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Color_SKU</TableHead>
                      <TableHead className="text-right">Inventory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productToDisplay.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell className="flex gap-3">
                          <div
                            style={{ background: variant.color?.hex }}
                            className="size-6 rounded-full"
                          />
                          {variant.color?.name}
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {variant.color_sku}
                        </TableCell>
                        <TableCell className="text-right">
                          {variant.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Card className="h-[25rem]">
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <Table className="h-[20rem]">
                  {productToDisplay.variants.length === 0 && (
                    <TableCaption>Empty list</TableCaption>
                  )}
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Size_SKU</TableHead>
                      <TableHead className="text-right">Inventory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productToDisplay.variants.map((variant) => (
                      <TableRow key={variant.product_id}>
                        <TableCell>
                          {variant.sizes?.name}
                          <span className="text-zinc-400">
                            | {variant.sizes?.code}
                          </span>
                        </TableCell>
                        <TableCell className="text-zinc-400">
                          {variant.size_sku}
                        </TableCell>

                        <TableCell className="text-right">
                          {variant.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              {/* By default the first image is the thumbnail */}
              <div className="flex items-center gap-2 flex-wrap">
                <div
                  key={JSON.parse(productToDisplay.productImgs)[0].name}
                  className="relative size-[12rem]"
                >
                  <Image
                    src={JSON.parse(productToDisplay.productImgs)[0].image}
                    alt={JSON.parse(productToDisplay.productImgs)[0].name}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap">
                {JSON.parse(productToDisplay.productImgs).map(
                  (img: { name: string; image: string }) => (
                    <div key={img.name} className="relative size-[12rem]">
                      <Image
                        src={img.image}
                        alt={img.name}
                        fill
                        priority
                        className="object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
