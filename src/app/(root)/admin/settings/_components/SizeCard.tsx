import { Card } from "@/components/ui/card";
import TableDeleteButton from "@/components/ui/table/table-delete-button";
import { Tables } from "@/types/supabase";

interface SizeCardProps {
  size: Tables<"sizes">;
}

export default function SizeCard({ size }: SizeCardProps) {
  return (
    <Card className="flex items-center justify-center py-1 px-2 gap-2 text-sm text-zinc-600">
      <div>
        {size.name} ({size.code})
      </div>
      <TableDeleteButton deleteBy={"sizes"} id={size.id} hasDelText={false} />
    </Card>
  );
}
