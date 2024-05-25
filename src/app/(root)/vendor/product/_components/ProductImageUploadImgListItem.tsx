import Image from "next/image";
import ProductImageUploadRemoveButton from "./ProductImageUploadRemoveButton";

interface ProductImageUploadImgListItemProps {
  post: {
    name: string;
    image: string;
  };
  bucketName: string;
  folderName: string;
}

export default function ProductImageUploadImgListItem({
  post,
  bucketName,
  folderName,
}: ProductImageUploadImgListItemProps) {
  return (
    <div key={post.name} className="relative size-[4rem]">
      <Image
        src={post.image}
        alt={post.name}
        fill
        priority
        className="object-cover rounded-full"
      />
      <ProductImageUploadRemoveButton
        post={post}
        bucketName={bucketName}
        folderName={folderName}
      />
    </div>
  );
}
