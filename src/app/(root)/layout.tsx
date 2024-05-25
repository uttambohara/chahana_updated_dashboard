import Header from "@/components/layout/Header";
import NavSidebar from "@/components/layout/NavSidebar";
import getUser from "@/lib/supabase-query";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="bg-zinc-50 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
