import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import LogoutButton from "./(auth)/logout/LogoutButton";
import SearchBar from "@/components/SearchBar";
import { getCartCount } from "@/lib/cart";

export default async function Header() {
  const user = await getCurrentUser();
  const cartCount = user ? await getCartCount(user.id) : 0;

  return (
    <header className="flex justify-between items-center py-2">
      <nav className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/cart" className="flex gap-2">
          Cart
          <span className="py-1 px-2 rounded-full bg-amber-400 text-black">
            {cartCount}
          </span>
        </Link>
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
