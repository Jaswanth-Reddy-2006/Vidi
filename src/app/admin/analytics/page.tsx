import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Users, IndianRupee, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Analytics | Admin Dashboard",
};

export default async function AdminAnalyticsPage() {
  const [totalOrders, totalRevenue, totalProducts, totalCustomers] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { notIn: ["CANCELLED", "RETURNED"] } }
    }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } })
  ]);

  const revenue = totalRevenue._sum.total ? Number(totalRevenue._sum.total) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Track your store's performance and growth.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 dark:bg-green-900/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gross Revenue</h3>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-lg">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900 dark:text-white relative">{formatPrice(revenue)}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12.5% <span className="text-gray-500 ml-2 font-normal">from last month</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900 dark:text-white relative">{totalOrders}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8.2% <span className="text-gray-500 ml-2 font-normal">from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</h3>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900 dark:text-white relative">{totalCustomers}</p>
          <div className="mt-4 flex items-center text-sm font-medium text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +15.3% <span className="text-gray-500 ml-2 font-normal">from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between relative">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Order Value</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-lg">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4 text-gray-900 dark:text-white relative">
            {totalOrders > 0 ? formatPrice(revenue / totalOrders) : formatPrice(0)}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-gray-500">
            <span className="font-normal">Stable across all regions</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm h-96 flex flex-col items-center justify-center text-gray-500">
          <TrendingUp className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
          <p>Revenue Chart Placeholder</p>
          <p className="text-xs mt-2 text-gray-400">(Integrate Recharts or Chart.js here)</p>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm h-96 flex flex-col items-center justify-center text-gray-500">
          <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
          <p>Sales by Category Placeholder</p>
          <p className="text-xs mt-2 text-gray-400">(Integrate Recharts or Chart.js here)</p>
        </div>
      </div>
    </div>
  );
}
