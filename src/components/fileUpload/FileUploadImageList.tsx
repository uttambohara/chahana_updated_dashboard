import Image from "next/image";

import { UploadImageAction } from "@/types/upload-image-types";
import FileUploadImageContainer from "@/components/fileUpload/FileUploadImageContainer";
import FileUploadImageRemove from "@/components/fileUpload/FileUploadImageRemove";

interface FileUploadImageListProps {
  dispatch?: React.Dispatch<UploadImageAction>;
  ArrayInString: string;
  onChange?: (imageArrInString: string) => void;
}

export default function FileUploadImageList({
  ArrayInString,
  onChange,
}: FileUploadImageListProps) {
  return (
    <div className="flex flex-col gap-1">
      {JSON.parse(ArrayInString).map(
        (imageData: { name: string; image: string }, index: number) => (
          <FileUploadImageContainer key={index}>
            <Image
              src={imageData.image}
              alt={imageData.name}
              fill
              priority
              className="object-cover rounded-full"
            />

            <FileUploadImageRemove onChange={onChange} imageData={imageData} />
          </FileUploadImageContainer>
        )
      )}
    </div>
  );
}
