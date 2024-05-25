interface FileUploadImageContainerProps {
  children: React.ReactNode;
}

export default function FileUploadImageContainer({
  children,
}: FileUploadImageContainerProps) {
  return <div className="relative h-24 w-24">{children}</div>;
}
