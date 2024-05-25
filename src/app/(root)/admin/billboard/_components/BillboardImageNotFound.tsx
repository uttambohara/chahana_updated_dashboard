export default function BillboardImageNotFound() {
  return (
    <div className="space-y-3 p-6">
      <h3 className="text-xl">No image selected yet!</h3>
      <div className="text-sm text-muted-foreground">
        <p>
          Please upload images by clicking the &quot;browse files&quot; button
          on the left.
        </p>
      </div>
    </div>
  );
}
