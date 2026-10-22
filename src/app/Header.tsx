import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import LogoutButton from "./(auth)/logout/LogoutButton";
import SearchBar from "@/components/SearchBar";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="flex justify-between items-center py-2">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link href="/profile">Profile</Link>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </nav>
      <SearchBar />
    </header>
  );
}
