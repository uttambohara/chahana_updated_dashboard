import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = await getUser();

  if (user?.role === "ADMIN") {
    return redirect("/admin");
  }

  if (user?.role === "CUSTOMER") {
    return redirect("/");
  }
  return <>{children}</>;
}
