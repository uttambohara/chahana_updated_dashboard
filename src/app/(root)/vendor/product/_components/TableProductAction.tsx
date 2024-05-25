import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableDeleteButton from "@/components/ui/table/table-delete-button";
import { CreateProductProvider } from "@/providers/create-product-provider";
import { UploadImageProvider } from "@/providers/upload-image-provider";
import { TProductWithCategorySubColorAndSizes } from "@/types";
import {
  Copy,
  Edit2,
  MoreHorizontal,
  ScreenShareIcon,
  ScreenShareOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useTransition } from "react";
import { ProductForm } from "./ProductForm";
import CreateNewProduct from "./CreateNewProduct";
import Link from "next/link";
import { toast } from "sonner";
import {
  createDuplicateProduct,
  updateProductPublishedStatus,
} from "@/actions/supabase/supabase-db";
import { VENDOR_PRODUCT_PARAM } from "@/lib/constant";

interface TableProductActionProps {
  rowWhichIsProduct: TProductWithCategorySubColorAndSizes;
}

export default function TableProductAction({
  rowWhichIsProduct,
}: TableProductActionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handlePublishedDraftStatus(
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    status: "Published" | "Draft",
    productId: number
  ) {
    e.stopPropagation();
    startTransition(async () => {
      const response = await updateProductPublishedStatus(productId, status);
      const { _, error } = JSON.parse(response);
      if (error) {
        toast.error(JSON.stringify(error));
      } else {
        toast.success("Product status has been changed.");
      }
      router.refresh();
    });
  }

  function handleDuplication(
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    productId: number
  ) {
    e.stopPropagation();
    startTransition(async () => {
      const response = await createDuplicateProduct(productId);
      const { _, error } = JSON.parse(response);
      if (error) {
        toast.error(JSON.stringify(error));
      } else {
        toast.success("Product duplicated.");
      }
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
          asChild
        >
          <Link href={`${VENDOR_PRODUCT_PARAM}/edit/${rowWhichIsProduct.id}`}>
            <Edit2 size={18} /> Edit
          </Link>
        </DropdownMenuItem>

        {rowWhichIsProduct.status.toLowerCase() === "published" && (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) =>
              handlePublishedDraftStatus(e, "Draft", rowWhichIsProduct.id)
            }
          >
            <ScreenShareOff size={18} />
            Unpublish
          </DropdownMenuItem>
        )}

        {rowWhichIsProduct.status.toLowerCase() === "draft" && (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={(e) =>
              handlePublishedDraftStatus(e, "Published", rowWhichIsProduct.id)
            }
          >
            <ScreenShareIcon size={18} /> Publish
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="flex items-center gap-2"
          onClick={(e) => handleDuplication(e, rowWhichIsProduct.id)}
        >
          <Copy size={18} /> Duplicate
        </DropdownMenuItem>
        <div
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <TableDeleteButton deleteBy="product" id={rowWhichIsProduct.id} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
