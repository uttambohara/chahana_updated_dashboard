"use client";

import { useUploadImage } from "@/providers/upload-image-provider";
import ProductImageUploadImgListItem from "./ProductImageUploadImgListItem";

interface ProductImageUploadImgListProps {
  bucketName: string;
  folderName: string;
}

export default function ProductImageUploadImgList({
  bucketName,
  folderName,
}: ProductImageUploadImgListProps) {
  const { state: ImageState } = useUploadImage();

  return (
    <div className="p-6">
      {ImageState.productImgs ? (
        ImageState.productImgs.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-3">
            {ImageState.productImgs.map((post) => (
              <ProductImageUploadImgListItem
                post={post}
                key={post.name}
                bucketName={bucketName}
                folderName={folderName}
              />
            ))}
          </div>
        ) : (
          // Optional: Display a message if there are no images
          <p>No images uploaded yet.</p>
        )
      ) : (
        // Optional: Display a message if ImageState.productImgs is not available
        <p>Loading images...</p>
      )}
    </div>
  );
}
