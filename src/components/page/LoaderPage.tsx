import { Loader2 } from "lucide-react";

export default function LoaderPage() {
  return (
    <div className="h-screen grid place-content-center">
      <Loader2 className="animate-spin text-zinc-700" size={40} />
    </div>
  );
}
