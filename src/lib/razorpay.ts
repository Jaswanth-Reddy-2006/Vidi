import Razorpay from "razorpay";

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
  console.warn("RAZORPAY_KEY_ID is not set. Payment features will not work.");
}

export const razorpay = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
  ? new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    })
  : (null as unknown as Razorpay);

export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
