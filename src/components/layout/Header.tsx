import SignOutButton from "../auth/SignOutButton";

export default async function Header() {
  return (
    <header className="h-[4rem] shadow-sm border-zinc-100 border flex items-center px-6">
      <div className="ml-auto">
        <SignOutButton />
      </div>
    </header>
  );
}
