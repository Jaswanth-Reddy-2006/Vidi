import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Tags, Plus } from "lucide-react";

export const metadata = {
  title: "Coupon Management | Admin Dashboard",
};

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">Coupons</h1>
          <p className="text-sm text-gray-500">Manage discount codes and promotional offers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900/50 text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Code</th>
                <th className="px-6 py-4 font-medium">Discount</th>
                <th className="px-6 py-4 font-medium">Min Order</th>
                <th className="px-6 py-4 font-medium">Usage Limit</th>
                <th className="px-6 py-4 font-medium">Valid Until</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tags className="w-8 h-8 text-gray-400" />
                      <p>No coupons found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.discountType === "percentage" 
                        ? `${coupon.discountValue}%` 
                        : formatPrice(Number(coupon.discountValue))}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.minOrderValue ? formatPrice(Number(coupon.minOrderValue)) : "None"}
                    </td>
                    <td className="px-6 py-4">
                      {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : "used"}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(coupon.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-maroon-700 dark:text-maroon-400 font-medium hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
