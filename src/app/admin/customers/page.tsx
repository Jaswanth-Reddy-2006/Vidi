import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search, Mail, Phone, MoreHorizontal, Download, User as UserIcon } from "lucide-react";

export const metadata = {
  title: "Customers | Admin | Vidi",
};

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      _count: {
        select: { orders: true },
      },
      orders: {
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate total spend for each customer
  const customersWithSpend = customers.map((customer) => {
    const totalSpend = customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );
    return { ...customer, totalSpend };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your customer base</p>
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
              placeholder="Search customers by name, email..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="flex-1 md:flex-none bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500">
              <option>Sort by: Newest</option>
              <option>Sort by: Orders</option>
              <option>Sort by: Spend</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Contact</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Orders</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Total Spend</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Joined</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {customersWithSpend.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-maroon-100 dark:bg-maroon-900/30 flex items-center justify-center shrink-0">
                        <span className="text-maroon-700 dark:text-maroon-400 font-medium text-sm">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {customer._count.orders} orders
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    ₹{customer.totalSpend.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                      new Date(customer.createdAt)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {customersWithSpend.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                        <UserIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No customers found</p>
                      <p className="text-sm mt-1">There are no customers matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {customersWithSpend.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
            <div>
              Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to{" "}
              <span className="font-medium text-gray-900 dark:text-white">{customersWithSpend.length}</span> of{" "}
              <span className="font-medium text-gray-900 dark:text-white">{customersWithSpend.length}</span> results
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
