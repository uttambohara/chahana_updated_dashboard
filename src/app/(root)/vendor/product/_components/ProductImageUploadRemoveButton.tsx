"use client";

import { deleteImgFromBucket } from "@/actions/supabase/supabase-db";
import { useUploadImage } from "@/providers/upload-image-provider";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductImageUploadRemoveButtonProps {
  post: { name: string; image: string };
  bucketName: string;
  folderName: string;
}

export default function ProductImageUploadRemoveButton({
  post,
  bucketName,
  folderName,
}: ProductImageUploadRemoveButtonProps) {
  const router = useRouter();
  const { dispatch } = useUploadImage();

  async function handleRemoveImgFromBucket(post: {
    name: string;
    image: string;
  }) {
    // ! Alert: Check if this is relevant in the upload section
    await deleteImgFromBucket(bucketName, post.name, folderName);

    dispatch({
      type: "REMOVE_IMAGE",
      payload: {
        productImg: {
          ...post,
        },
      },
    });
    router.refresh();
  }
  return (
    <div
      className="absolute left-1/2 top-2 flex -translate-x-1/2 cursor-pointer items-center justify-center gap-1 rounded-full bg-red-400/30 p-2 text-xs text-orange-600 shadow-md backdrop-blur-md transition-all hover:bg-red-600/30 hover:text-red-800"
      onClick={() => {
        handleRemoveImgFromBucket(post);
      }}
    >
      <X size={18} />
    </div>
  );
}
