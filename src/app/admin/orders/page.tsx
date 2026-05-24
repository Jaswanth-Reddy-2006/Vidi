import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Eye, Filter, Calendar, Download } from "lucide-react";

export const metadata = {
  title: "Orders | Admin | Vidi",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "CONFIRMED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20";
      case "PACKED":
      case "SHIPPED":
      case "OUT_FOR_DELIVERY":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      case "DELIVERED":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "CANCELLED":
      case "RETURNED":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track customer orders</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500 appearance-none">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Yesterday</option>
                <option>Today</option>
              </select>
            </div>
            <div className="relative flex-1 md:flex-none">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="w-full pl-9 pr-8 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500 appearance-none">
                <option>Status: All</option>
                <option>Placed</option>
                <option>Confirmed</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Date</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Total</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-maroon-700 dark:text-maroon-400 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                    <div className="text-xs text-gray-500 mt-0.5">{order.items.length} items</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(order.createdAt))}
                    <div className="text-xs text-gray-400">
                      {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).format(new Date(order.createdAt))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                    <div className="text-xs text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    ₹{order.total?.toString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center justify-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                        <Filter className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No orders found</p>
                      <p className="text-sm mt-1">There are no orders matching your current filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {orders.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
            <div>
              Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to{" "}
              <span className="font-medium text-gray-900 dark:text-white">{orders.length}</span> of{" "}
              <span className="font-medium text-gray-900 dark:text-white">{orders.length}</span> results
            </div>
            <div className="flex gap-1">
              <button
                disabled
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled
                className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
