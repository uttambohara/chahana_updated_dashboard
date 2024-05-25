import Header from "@/components/layout/Header";
import NavSidebar from "@/components/layout/NavSidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <NavSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="bg-zinc-50 h-[calc(100svh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
