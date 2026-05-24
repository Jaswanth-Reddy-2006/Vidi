"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/features/cart/actions/cart-actions";
import { useCartStore } from "@/features/cart/store/cart-store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  isBuyNow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  productId,
  variantId,
  isBuyNow = false,
  className,
  children,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const incrementItemCount = useCartStore((state) => state.incrementItemCount);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const result = await addToCart(productId, 1, variantId);
      if (result.success) {
        incrementItemCount(1);
        if (isBuyNow) {
          router.push("/cart"); // Redirect to cart for checkout flow
        } else {
          toast.success("Added to cart successfully!");
        }
      }
    } catch (error: any) {
      if (error.message.includes("logged in")) {
        toast.error("Please sign in to add to cart");
        const loginUrl = new URL(window.location.origin + "/login");
        loginUrl.searchParams.set("callbackUrl", window.location.pathname);
        router.push(loginUrl.toString());
      } else {
        toast.error(error.message || "Failed to add to cart");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isBuyNow ? null : (
        <ShoppingBag className="w-4 h-4 mr-2" />
      )}
      {children || (isBuyNow ? "Buy it Now" : "Add to Cart")}
    </Button>
  );
}
