import Link from "next/link";
import Image from "next/image";
import { getCart, removeFromCart, updateCartItemQuantity } from "@/features/cart/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Your Cart | Vidi",
  description: "View and manage your shopping cart.",
};

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-maroon-50 dark:bg-maroon-950/30 rounded-full flex items-center justify-center text-maroon-700 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Looks like you haven't added any gorgeous sarees to your cart yet. Let's explore our collection!
        </p>
        <Link href="/products">
          <Button size="lg" className="bg-maroon-800 hover:bg-maroon-900 text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.items.reduce((total, item) => {
    const price = item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.basePrice);
    return total + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
  const tax = subtotal * 0.05; // Assuming 5% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {cart.items.map((item) => {
                const price = item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.basePrice);
                const image = item.product.images[0]?.url || "https://images.unsplash.com/photo-1583391733958-d150247ec6cb?q=80&w=600&auto=format&fit=crop";
                
                return (
                  <li key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6">
                    <div className="relative w-24 h-32 sm:w-32 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <Link href={`/products/${item.product.slug}`} className="hover:text-maroon-700 transition-colors">
                            <h3 className="text-lg font-semibold font-heading line-clamp-2">{item.product.name}</h3>
                          </Link>
                          {item.variantId && (
                            <p className="text-sm text-gray-500 mt-1">Variant: {item.variantId}</p>
                          )}
                        </div>
                        <div className="text-right font-bold text-lg">
                          {formatPrice(price * item.quantity)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg">
                          {/* Note: In a real app, these buttons would use useTransition and the server actions */}
                          <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button className="text-red-500 hover:text-red-700 p-2 transition-colors flex items-center gap-2 text-sm font-medium">
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 sticky top-24">
            <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="text-gray-900 dark:text-white font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900 dark:text-white font-medium"}>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Tax (5%)</span>
                <span className="text-gray-900 dark:text-white font-medium">{formatPrice(tax)}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-maroon-800 dark:text-maroon-400">{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full block mb-4">
              <Button size="lg" className="w-full bg-maroon-800 hover:bg-maroon-900 text-white h-14 text-lg rounded-xl">
                Proceed to Checkout
              </Button>
            </Link>
            
            <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick component for shield icon inline
function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
