import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";

export default async function Home() {
  const { data: user } = await getUser();

  if (user?.role === "ADMIN") {
    return redirect("/admin");
  }

  if (user?.role === "VENDOR") {
    return redirect("/vendor");
  }
  return <div>Customer</div>;
}
