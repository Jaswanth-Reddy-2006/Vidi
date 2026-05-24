import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, ShoppingBag } from "lucide-react";
import { BulkImportButton } from "@/features/admin/components/bulk-import-button";

export const metadata = {
  title: "Products | Admin | Vidi",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <BulkImportButton />
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-maroon-700 hover:bg-maroon-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select className="flex-1 md:flex-none bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500">
              <option>All Categories</option>
              <option>Silk</option>
              <option>Cotton</option>
              <option>Linen</option>
            </select>
            <select className="flex-1 md:flex-none bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maroon-500">
              <option>Status: All</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Product</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Price</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Stock</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-6 py-3.5 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {product.category?.name || "Uncategorized"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                    ₹{product.basePrice?.toString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        product.stockQuantity > 10
                          ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                          : product.stockQuantity > 0
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                          : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                      }`}
                    >
                      {product.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                        product.isActive
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
                          : "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20"
                      }`}
                    >
                      {product.isActive ? "Active" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No products found</p>
                      <p className="text-sm mt-1">Get started by creating a new product.</p>
                      <Link
                        href="/admin/products/new"
                        className="mt-4 inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {products.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
            <div>
              Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to{" "}
              <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> of{" "}
              <span className="font-medium text-gray-900 dark:text-white">{products.length}</span> results
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
