import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadImageProvider } from "@/providers/upload-image-provider";
import BillboardFileUpload from "./_components/BillboardFileUpload";
import BillboardImageList from "./_components/BillboardImageList";
import BillboardTable from "./_components/BillboardTable";

export default function BillboardPage() {
  return (
    <div className="max-w-screen-lg mx-auto py-10">
      <Card>
        <CardHeader className="flex-row items-center justify-between py-4">
          <CardTitle className="text-xl font-semibold">Billboard</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadImageProvider>
            <div className="grid md:grid-cols-[50%_1fr] items-center md:gap-6">
              <BillboardFileUpload />
              <BillboardImageList />
            </div>
          </UploadImageProvider>
          <BillboardTable />
        </CardContent>
      </Card>
    </div>
  );
}
