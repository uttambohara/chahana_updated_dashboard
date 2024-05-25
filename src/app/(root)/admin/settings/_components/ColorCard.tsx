import TableDeleteButton from "@/components/ui/table/table-delete-button";
import { Tables } from "@/types/supabase";

interface ColorCardProps {
  color: Tables<"color">;
}

export default function ColorCard({ color }: ColorCardProps) {
  return (
    <div
      className={`rounded-full h-16 w-16 flex items-center justify-center relative`}
      style={{ backgroundColor: color.hex }}
    >
      <div className="absolute top-0 right-0">
        <TableDeleteButton
          deleteBy={"color"}
          id={color.id}
          hasDelText={false}
        />
      </div>
    </div>
  );
}
