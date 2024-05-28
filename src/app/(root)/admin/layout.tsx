import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = await getUser();

  if (!user) redirect("/auth/login");
  if (user?.role === "VENDOR") {
    return redirect("/vendor");
  }

  if (user?.role === "CUSTOMER") {
    return redirect("/");
  }
  return <>{children}</>;
}
