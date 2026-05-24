"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { verifyPayment } from "../actions/payment-actions";
import { toast } from "sonner";
import { RAZORPAY_KEY_ID } from "@/lib/razorpay";

interface RazorpayCheckoutProps {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  onSuccess?: () => void;
  onFailure?: () => void;
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setIsLoaded(true);
    }
  }, []);

  return {
    isLoaded,
    Script: (
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsLoaded(true)}
      />
    ),
  };
}

export function openRazorpayCheckout({
  orderId,
  razorpayOrderId,
  amount,
  user,
  router,
  setLoading
}: RazorpayCheckoutProps & { router: any, setLoading: (b: boolean) => void }) {
  if (typeof window === "undefined" || !(window as any).Razorpay) {
    toast.error("Payment system is not loaded yet. Please try again.");
    setLoading(false);
    return;
  }

  const options = {
    key: RAZORPAY_KEY_ID,
    amount: Math.round(amount * 100),
    currency: "INR",
    name: "Vidi",
    description: "Saree Purchase",
    order_id: razorpayOrderId,
    handler: async function (response: any) {
      try {
        setLoading(true);
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId,
        });
        toast.success("Payment successful!");
        router.push(`/orders/success?orderId=${orderId}`);
      } catch (error: any) {
        toast.error("Payment verification failed.");
        router.push(`/checkout?error=verification_failed`);
      } finally {
        setLoading(false);
      }
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone || "",
    },
    theme: {
      color: "#800020", // Deep Maroon
    },
    modal: {
      ondismiss: function () {
        setLoading(false);
        toast.error("Payment cancelled");
      },
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", function (response: any) {
    toast.error(response.error.description || "Payment failed");
    setLoading(false);
  });
  rzp.open();
}
