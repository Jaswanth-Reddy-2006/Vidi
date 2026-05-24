import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Handle the event
    if (event.event === "order.paid") {
      const orderEntity = event.payload.order.entity;
      const paymentEntity = event.payload.payment.entity;

      const razorpayOrderId = orderEntity.id;
      const razorpayPaymentId = paymentEntity.id;

      // Find the payment in our database
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId },
        include: { order: true },
      });

      if (payment && payment.status !== "PAID") {
        // Update payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            razorpayPaymentId,
            paidAt: new Date(),
          },
        });

        // Update order status
        if (payment.order.status === "PLACED") {
          await prisma.order.update({
            where: { id: payment.order.id },
            data: {
              status: "CONFIRMED",
              timeline: {
                create: {
                  status: "CONFIRMED",
                  note: "Payment confirmed via webhook.",
                },
              },
            },
          });
        }
      }
    } else if (event.event === "payment.failed") {
      const paymentEntity = event.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;

      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId },
      });

      if (payment && payment.status === "PENDING") {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            failureReason: paymentEntity.error_description || "Payment failed",
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
