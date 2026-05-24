"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getCart } from "@/features/cart/actions/cart-actions";
import { razorpay } from "@/lib/razorpay";
import { AddressFormValues } from "@/features/cart/components/address-form";
import crypto from "crypto";

export async function createOrderAndPayment(data: { address: AddressFormValues; method: "COD" | "RAZORPAY" }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new Error("You must be logged in to checkout");
  }

  const cart = await getCart();
  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  // Calculate totals
  let subtotal = 0;
  cart.items.forEach(item => {
    const price = item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.basePrice);
    subtotal += price * item.quantity;
  });

  const shippingCharge = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.05; // Assuming 5% tax
  const total = subtotal + shippingCharge + tax;

  // Create address
  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      fullName: data.address.fullName,
      phone: data.address.phone,
      addressLine1: data.address.addressLine1,
      addressLine2: data.address.addressLine2,
      city: data.address.city,
      state: data.address.state,
      pincode: data.address.pincode,
    }
  });

  // Create order
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      addressId: address.id,
      status: "PLACED",
      subtotal,
      shippingCharge,
      tax,
      total,
      items: {
        create: cart.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          productName: item.product.name,
          productImage: item.product.images[0]?.url || "",
          quantity: item.quantity,
          unitPrice: item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.basePrice),
          totalPrice: (item.product.salePrice ? Number(item.product.salePrice) : Number(item.product.basePrice)) * item.quantity,
        }))
      },
      timeline: {
        create: {
          status: "PLACED",
          note: "Order has been placed",
        }
      }
    }
  });

  // Create payment record
  let razorpayOrderId = null;

  if (data.method === "RAZORPAY") {
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // in paise
      currency: "INR",
      receipt: order.id,
    });
    
    razorpayOrderId = rzpOrder.id;

    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: "RAZORPAY",
        status: "PENDING",
        amount: total,
        currency: "INR",
        razorpayOrderId: rzpOrder.id,
      }
    });
  } else {
    await prisma.payment.create({
      data: {
        orderId: order.id,
        method: "COD",
        status: "PENDING",
        amount: total,
        currency: "INR",
      }
    });
  }

  // Clear cart
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
    total,
    razorpayOrderId,
  };
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("Razorpay secret not configured");
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(data.razorpay_order_id + "|" + data.razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== data.razorpay_signature) {
    await prisma.payment.update({
      where: { razorpayOrderId: data.razorpay_order_id },
      data: { status: "FAILED", failureReason: "Signature verification failed" }
    });
    throw new Error("Invalid signature");
  }

  // Update payment
  await prisma.payment.update({
    where: { razorpayOrderId: data.razorpay_order_id },
    data: {
      status: "PAID",
      razorpayPaymentId: data.razorpay_payment_id,
      razorpaySignature: data.razorpay_signature,
      paidAt: new Date(),
    }
  });

  // Update order status if needed (e.g. from PLACED to CONFIRMED)
  await prisma.order.update({
    where: { id: data.orderId },
    data: {
      status: "CONFIRMED",
      timeline: {
        create: {
          status: "CONFIRMED",
          note: "Payment received. Order confirmed.",
        }
      }
    }
  });

  return { success: true };
}
