import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function getStatusColor(status: string) {
  switch (status) {
    case "PLACED": return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
    case "CONFIRMED": return "bg-blue-200 text-blue-900 border-blue-300 hover:bg-blue-200";
    case "PACKED": return "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100";
    case "SHIPPED": return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100";
    case "OUT_FOR_DELIVERY": return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100";
    case "DELIVERED": return "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
    case "CANCELLED": return "bg-red-100 text-red-800 border-red-200 hover:bg-red-100";
    case "RETURNED": return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
    default: return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100";
  }
}

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-playfair font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Link href="/products">
              <Button className="bg-maroon hover:bg-maroon/90 text-white">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="bg-muted/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order Placed</p>
                  <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                  <p className="font-medium text-sm">₹{Number(order.total).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Order #</p>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                </div>
                <div className="sm:ml-auto">
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6 border-b pb-4">
                  <Badge className={`px-3 py-1 uppercase tracking-wider text-[10px] ${getStatusColor(order.status)}`} variant="outline">
                    {order.status.replace(/_/g, " ")}
                  </Badge>
                  {order.estimatedDelivery && (
                    <p className="text-sm text-muted-foreground">
                      Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6">
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
                        <Link href={`/products/${item.product.slug}`} className="font-medium text-lg hover:text-maroon transition-colors line-clamp-2">
                          {item.productName}
                        </Link>
                        <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                        <div className="mt-auto flex justify-between items-end">
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="font-medium">₹{Number(item.totalPrice).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
