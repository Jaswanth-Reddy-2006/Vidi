import { z } from "zod";

export const createOrderSchema = z.object({
  addressId: z.string().cuid("Invalid address ID"),
  items: z.array(
    z.object({
      productId: z.string().cuid(),
      variantId: z.string().cuid().optional(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Order must contain at least one item"),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
  couponCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PLACED",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "RETURNED",
  ]),
  note: z.string().max(500).optional(),
});
