import FileUploadImageRemove from "@/components/fileUpload/FileUploadImageRemove";
import { UploadImageAction } from "@/types/upload-image-types";
import Image from "next/image";
import React, { Dispatch } from "react";

interface BillboardImageItem {
  img: {
    name: string;
    image: string;
  };
  dispatch: Dispatch<UploadImageAction>;
}

export default function BillboardImageItem({
  img,
  dispatch,
}: BillboardImageItem) {
  return (
    <div key={img.name} className="relative size-24">
      <Image
        src={img.image}
        alt={img.name}
        fill
        priority
        className="object-cover rounded-full"
      />
      <FileUploadImageRemove imageData={img} dispatch={dispatch} />
    </div>
  );
}
