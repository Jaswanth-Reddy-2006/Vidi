"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "../actions/product-actions";
import { ImageUpload } from "./image-upload";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

type ProductFormProps = {
  initialData?: any;
  categories: any[];
};

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    categoryId: initialData?.categoryId || "",
    basePrice: initialData?.basePrice || "",
    salePrice: initialData?.salePrice || "",
    stockQuantity: initialData?.stockQuantity || "",
    fabric: initialData?.fabric || "",
    isActive: initialData !== undefined ? initialData.isActive : true,
    isFeatured: initialData?.isFeatured || false,
    images: initialData?.images?.map((img: any) => img.url) || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const dataToSubmit = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      // Convert flat array of URLs back into what product-actions expects
      images: formData.images.map((url: string) => ({ url })),
    };

    try {
      const res = initialData
        ? await updateProduct(initialData.id, dataToSubmit)
        : await createProduct(dataToSubmit);

      if (res.success) {
        router.push("/admin/products");
      } else {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-2xl font-bold">{initialData ? "Edit Product" : "Create New Product"}</h1>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-maroon-800 hover:bg-maroon-900 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {initialData ? "Update Product" : "Save Product"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-3">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">URL Slug</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="auto-generated-if-empty" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <input required type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Description</label>
              <textarea required rows={5} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fabric/Material</label>
              <input type="text" name="fabric" value={formData.fabric} onChange={handleChange} placeholder="e.g. Pure Silk" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-3">Pricing & Inventory</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Base Price (MRP)</label>
              <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sale Price (Optional)</label>
              <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input required type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-3">Organization</h2>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-1 focus:ring-maroon-500 outline-none">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-maroon-600 rounded" />
                <span className="text-sm font-medium">Active (Visible on store)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-maroon-600 rounded" />
                <span className="text-sm font-medium">Featured Product</span>
              </label>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <h2 className="text-lg font-bold border-b border-gray-100 dark:border-gray-800 pb-3">Product Media</h2>
            
            <ImageUpload 
              value={formData.images} 
              onChange={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
              onRemove={(url) => setFormData(prev => ({ ...prev, images: prev.images.filter((current: string) => current !== url) }))}
            />
            <p className="text-xs text-gray-500">
              Note: You need to set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables for uploads to work.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
