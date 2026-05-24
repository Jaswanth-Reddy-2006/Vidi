import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }

  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/orders");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      address: true,
      items: true,
      payment: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    redirect("/orders");
  }

  return (
    <div className="container max-w-3xl py-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h1 className="text-4xl font-playfair font-semibold mb-4 text-gray-900">
        Order Confirmed!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. Your order number is <span className="font-semibold text-gray-900">{order.orderNumber}</span>.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-left mb-8">
        <h2 className="text-xl font-semibold mb-6 border-b pb-4">Order Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" /> Order Details
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Date: {new Date(order.createdAt).toLocaleDateString()}</li>
              <li>Status: {order.status}</li>
              <li>Payment Method: {order.payment?.method}</li>
              <li>Payment Status: {order.payment?.status}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4" /> Shipping Address
            </h3>
            <div className="text-sm text-gray-600">
              <p>{order.address.fullName}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="font-medium text-gray-900 mb-4">Items Ordered</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex gap-4">
                  {item.productImage && (
                    <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-md" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{Number(item.totalPrice).toFixed(2)}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href={`/orders/${order.id}`}>
          <Button className="min-w-40">Track Order</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="min-w-40"><Home className="mr-2 h-4 w-4" /> Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
