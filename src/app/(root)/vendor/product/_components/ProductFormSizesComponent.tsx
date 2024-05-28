import { Card } from "@/components/ui/card";
import { useCreateProduct } from "@/providers/create-product-provider";
import { Tables } from "@/types/supabase";
import clsx from "clsx";

interface ProductFormSizesComponentProps {
  sizes: Tables<"sizes">[] | null;
}

export default function ProductFormSizesComponent({
  sizes,
}: ProductFormSizesComponentProps) {
  const { state, dispatch } = useCreateProduct();

  function handleUpdateSizeDispatch(size: Tables<"sizes">) {
    dispatch({
      type: "SET_SIZE",
      payload: {
        size,
      },
    });
  }

  return (
    <ul className="flex items-center gap-3 flex-wrap p-4">
      {sizes?.map((size) => (
        <Card
          onClick={() => handleUpdateSizeDispatch(size)}
          key={size.id}
          className={clsx(
            `grid place-content-center size-6 cursor-pointer p-3 text-muted-foreground
            ring ring-gray-500 ring-offset-2`
          )}
        >
          {size.code}
        </Card>
      ))}
    </ul>
  );
}
