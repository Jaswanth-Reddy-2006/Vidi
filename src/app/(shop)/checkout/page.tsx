"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AddressForm, AddressFormValues } from "@/features/cart/components/address-form";
import { CheckoutSteps } from "@/features/cart/components/checkout-steps";
import { createOrderAndPayment } from "@/features/payments/actions/payment-actions";
import { useRazorpay, openRazorpayCheckout } from "@/features/payments/components/razorpay-checkout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [addressData, setAddressData] = useState<AddressFormValues | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [isLoading, setIsLoading] = useState(false);
  
  const { isLoaded, Script } = useRazorpay();

  // In a real app, we would fetch the cart to show order summary here
  // For simplicity, we just trigger the server action which fetches the cart

  const handleAddressSubmit = (data: AddressFormValues) => {
    setAddressData(data);
    setStep(2);
  };

  const handleCheckout = async () => {
    if (!addressData) return;
    
    setIsLoading(true);
    try {
      const res = await createOrderAndPayment({ address: addressData, method: paymentMethod });
      
      if (paymentMethod === "COD") {
        toast.success("Order placed successfully!");
        router.push(`/orders/success?orderId=${res.orderId}`);
      } else {
        if (!res.razorpayOrderId) {
          throw new Error("Could not initialize Razorpay payment");
        }
        
        openRazorpayCheckout({
          orderId: res.orderId,
          razorpayOrderId: res.razorpayOrderId,
          amount: res.total,
          user: {
            name: session?.user?.name || "Guest",
            email: session?.user?.email || "",
            phone: addressData.phone,
          },
          router,
          setLoading: setIsLoading,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4">Please log in to checkout</h1>
        <Button onClick={() => router.push("/login?redirect=/checkout")}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      {Script}
      <h1 className="text-3xl font-playfair font-semibold mb-8">Checkout</h1>
      
      <div className="mb-10">
        <CheckoutSteps currentStep={step} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>
              <AddressForm onSubmit={handleAddressSubmit} defaultValues={addressData || undefined} />
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              
              <div className="space-y-4 mb-8">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="RAZORPAY" 
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="mr-4 h-4 w-4 text-maroon-600 focus:ring-maroon-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Pay Online (Razorpay)</div>
                    <div className="text-sm text-gray-500">Credit Card, UPI, NetBanking</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="mr-4 h-4 w-4 text-maroon-600 focus:ring-maroon-600"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when your order arrives</div>
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleCheckout} disabled={isLoading || (!isLoaded && paymentMethod === "RAZORPAY")}>
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="text-sm text-gray-500 mb-4">
              Your cart items will be processed upon order placement. Total is calculated dynamically.
            </div>
            
            {addressData && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-2">Shipping To:</h3>
                <div className="text-sm text-gray-600">
                  <p>{addressData.fullName}</p>
                  <p>{addressData.addressLine1}</p>
                  {addressData.addressLine2 && <p>{addressData.addressLine2}</p>}
                  <p>{addressData.city}, {addressData.state} - {addressData.pincode}</p>
                  <p>Phone: {addressData.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
