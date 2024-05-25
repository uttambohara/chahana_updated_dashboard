"use client";

import FileUploadImage from "@/components/fileUpload/FileUploadImage";
import { useUploadImage } from "@/providers/upload-image-provider";

export default function BillboardFileUpload() {
  const { dispatch } = useUploadImage();

  return (
    <div className="space-y-2">
      <FileUploadImage
        fileNumber={5}
        bucketName={"admin"}
        folderName={"billboard"}
        dispatch={dispatch}
      />
    </div>
  );
}
