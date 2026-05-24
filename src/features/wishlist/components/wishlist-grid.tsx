"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleWishlist } from "@/features/wishlist/actions/wishlist-actions";
import { addToCart } from "@/features/cart/actions/cart-actions";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function WishlistGrid({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const handleRemove = async (productId: string) => {
    try {
      const res = await toggleWishlist(productId);
      if (res.success) {
        setItems(items.filter(item => item.product.id !== productId));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleMoveToCart = async (productId: string) => {
    try {
      await addToCart(productId, 1);
      await toggleWishlist(productId);
      setItems(items.filter(item => item.product.id !== productId));
      toast.success("Moved to cart!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to move to cart. Please make sure you're logged in.");
    }
  };

  if (items.length === 0) {
    return (
      <Card className="text-center py-16 border-dashed">
        <CardContent className="pt-6">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">Save items you love to your wishlist to review them later.</p>
          <Link href="/products">
            <Button className="bg-maroon hover:bg-maroon/90 text-white">Start Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const product = item.product;
        const image = product.images?.[0]?.url;
        
        return (
          <Card key={item.id} className="overflow-hidden group border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-[3/4] bg-muted">
              {image ? (
                <img 
                  src={image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500 hover:text-red-600 transition-colors"
                onClick={() => handleRemove(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <Link href={`/products/${product.slug}`} className="block mb-2">
                <h3 className="font-medium hover:text-maroon transition-colors line-clamp-1">{product.name}</h3>
              </Link>
              
              <div className="flex items-center gap-2 mb-4">
                {product.salePrice ? (
                  <>
                    <span className="font-semibold">₹{Number(product.salePrice).toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{Number(product.basePrice).toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-semibold">₹{Number(product.basePrice).toFixed(2)}</span>
                )}
              </div>
              
              <Button 
                className="w-full gap-2 bg-black hover:bg-black/90 text-white" 
                onClick={() => handleMoveToCart(product.id)}
              >
                <ShoppingCart className="h-4 w-4" />
                Move to Cart
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
