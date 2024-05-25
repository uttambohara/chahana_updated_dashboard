import { TableCell, TableRow } from "@/components/ui/table";
import TableDeleteButton from "@/components/ui/table/table-delete-button";
import { Tables } from "@/types/supabase";
import Image from "next/image";

interface BillboardTableRowProps {
  billboard: Tables<"billboard">;
}
export default function BillboardTableRow({
  billboard,
}: BillboardTableRowProps) {
  return (
    <TableRow key={billboard.id}>
      <TableCell>
        <div className="h-8 w-8 relative rounded-md">
          <Image
            src={billboard.image_url}
            alt={billboard.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{billboard.name}</TableCell>
      <TableCell>
        <TableDeleteButton
          deleteBy={"billboard"}
          id={billboard.id}
          hasDelText={false}
        />
      </TableCell>
    </TableRow>
  );
}
