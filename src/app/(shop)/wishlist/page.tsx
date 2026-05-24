import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getWishlist } from "@/features/wishlist/actions/wishlist-actions";
import { WishlistGrid } from "@/features/wishlist/components/wishlist-grid";

export const metadata = {
  title: "My Wishlist | Vidi",
  description: "View and manage your saved items.",
};

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/login");
  }

  const wishlist = await getWishlist();
  const items = wishlist?.items || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">
          {items.length} {items.length === 1 ? "item" : "items"} saved
        </p>
      </div>

      <WishlistGrid initialItems={items} />
    </div>
  );
}
