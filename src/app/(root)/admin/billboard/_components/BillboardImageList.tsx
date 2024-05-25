"use client";

import { useUploadImage } from "@/providers/upload-image-provider";
import BillboardImageItem from "./BillboardImageItem";
import BillboardImageNotFound from "./BillboardImageNotFound";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { uploadBillboardImages } from "@/actions/supabase/supabase-db";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import LoaderEl from "@/components/LoaderEl";
import { Upload } from "lucide-react";

export default function BillboardImageList() {
  const { state, dispatch } = useUploadImage();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleBillboardUpload() {
    startTransition(async () => {
      const imagesFromState = state.productImgs;
      if (!!!imagesFromState?.length) {
        toast.error("There are currently no images on the state to display.!");
        return;
      }
      const response = await uploadBillboardImages(imagesFromState);
      if (response.length > 0) {
        toast.success("Billboard image uploaded");
      }
      dispatch({ type: "RESET" });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {!!!state.productImgs?.length && <BillboardImageNotFound />}

      <div className="flex items-center gap-2">
        {state.productImgs?.map((img) => (
          <BillboardImageItem key={img.name} img={img} dispatch={dispatch} />
        ))}
      </div>

      <div className="flex md:justify-start justify-center w-full">
        <Button
          onClick={handleBillboardUpload}
          className={clsx("flex items-center gap-1 mt-4 text-xs mb-2 w-full", {
            hidden: !!!state.productImgs?.length,
          })}
        >
          {isPending && <LoaderEl />}
          {!isPending && <Upload size={16} />}
          Complete upload
        </Button>
      </div>
    </div>
  );
}
