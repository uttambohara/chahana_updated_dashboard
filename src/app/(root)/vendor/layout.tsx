import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
