import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Plus, Image as ImageIcon } from "lucide-react";

export const metadata = {
  title: "Banner Management | Admin Dashboard",
};

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100">Banners</h1>
          <p className="text-sm text-gray-500">Manage homepage hero banners and promotions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-maroon-800 hover:bg-maroon-900 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900/50 text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Link</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                      <p>No banners found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image 
                          src={banner.image} 
                          alt={banner.title} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white mb-1">{banner.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{banner.subtitle}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                      {banner.link || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {banner.sortOrder}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {banner.isActive ? "Active" : "Inactive"}
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
