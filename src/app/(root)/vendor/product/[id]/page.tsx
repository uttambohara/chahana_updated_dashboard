import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VENDOR_PRODUCT_PARAM } from "@/lib/constant";
import { getProductById } from "@/lib/supabase-query";
import { formatCurrencyToNPR } from "@/lib/utils/format-currency";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function IndividialProduct({
  params,
}: {
  params: { id: string };
}) {
  const productId = Number(params.id);

  const { product, error } = await getProductById(productId);

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
          href={`${VENDOR_PRODUCT_PARAM}`}
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
                      <div>SKU</div>
                      <div>{productToDisplay.sku}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Material</div>
                      <div>{productToDisplay.material || "-"}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Discountables</div>
                      <div>{productToDisplay.discountable || "-"}</div>
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
                      <div className="font-semibold text-black">
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
                        ? `${productToDisplay.length} kg`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="font-semibold">Dimensions</h2>
                <div className="text-muted-foreground mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>Colors</div>
                    <div>
                      {productToDisplay.color.map((c) => (
                        <span key={c.id}>{c.name}| </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>Sizes</div>
                    <div>
                      {productToDisplay.sizes.map((s) => (
                        <span key={s.id}>{s.name}| </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="h-[25rem]">
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h2 className="font-semibold mb-4">Size Variant</h2>
                <Table>
                  <TableCaption>A list of your size variants.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Title</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>EAN</TableHead>
                      <TableHead className="text-right">Inventory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productToDisplay.product_size.map((ps) => (
                      <TableRow key={ps.product_id}>
                        <TableCell>{ps.sizes?.code}</TableCell>
                        <TableCell>{ps.sku}</TableCell>
                        <TableCell>{ps.ean}</TableCell>
                        <TableCell className="text-right">
                          {ps.quantity}
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
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h2 className="font-semibold mb-4">Color Variant</h2>
                <Table>
                  <TableCaption>A list of your color variants</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Title</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>EAN</TableHead>
                      <TableHead className="text-right">Inventory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productToDisplay.product_color.map((pc) => (
                      <TableRow key={pc.product_id}>
                        <TableCell>{pc.color?.name}</TableCell>
                        <TableCell>{pc.sku}</TableCell>
                        <TableCell>{pc.ean}</TableCell>
                        <TableCell className="text-right">
                          {pc.quantity}
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
