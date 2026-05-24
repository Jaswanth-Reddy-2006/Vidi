import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderTimeline } from "@/features/orders/components/order-timeline";
import { Separator } from "@/components/ui/separator";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { 
      id: orderId,
      userId: session.user.id,
    },
    include: {
      items: {
        include: { product: true },
      },
      address: true,
      payment: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/orders" className="inline-flex">
          <Button variant="ghost" className="mb-4 -ml-4 hover:bg-transparent hover:text-maroon">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold mb-2">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          {order.status === "DELIVERED" && (
            <Link href={`/orders/${order.id}/invoice`}>
              <Button variant="outline">Download Invoice</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderTimeline 
                status={order.status} 
                createdAt={order.createdAt} 
                deliveredAt={order.deliveredAt}
                cancelledAt={order.cancelledAt}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Items in your order</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                    {item.productImage ? (
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-24 h-32 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                      <div className="w-24 h-32 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <Link href={`/products/${item.product.slug}`} className="font-medium text-lg hover:text-maroon transition-colors">
                          {item.productName}
                        </Link>
                        <p className="font-semibold whitespace-nowrap">₹{Number(item.totalPrice).toFixed(2)}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="mt-auto pt-4">
                        <Link href={`/products/${item.product.slug}`}>
                          <Button variant="outline" size="sm">Buy Again</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{Number(order.shippingCharge) === 0 ? "Free" : `₹${Number(order.shippingCharge).toFixed(2)}`}</span>
              </div>
              {Number(order.tax) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{Number(order.tax).toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{Number(order.total).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="font-medium mb-1">{order.address.fullName}</p>
              <p className="text-sm text-muted-foreground break-words">{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p className="text-sm text-muted-foreground break-words">{order.address.addressLine2}</p>}
              <p className="text-sm text-muted-foreground break-words">
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
              <p className="text-sm text-muted-foreground mt-2">Phone: {order.address.phone}</p>
            </CardContent>
          </Card>

          {order.payment && (
            <Card>
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">{order.payment.method === "COD" ? "Cash on Delivery" : "Online Payment"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{order.payment.status}</span>
                </div>
                {order.payment.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-medium break-all text-right ml-4">{order.payment.razorpayPaymentId}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
