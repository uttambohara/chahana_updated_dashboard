export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950 overflow-y-auto">
      {children}
    </main>
  );
}
