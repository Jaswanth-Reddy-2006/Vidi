"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "./product-card";
import { fetchProductsAction } from "../actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ProductGridClientProps {
  initialProducts: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  categories: any[];
  currentCategory?: string;
  currentSort?: string;
}

export function ProductGridClient({ 
  initialProducts, 
  pagination, 
  categories, 
  currentCategory, 
  currentSort 
}: ProductGridClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(pagination.page);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  
  const hasMore = page < pagination.totalPages;

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetchProductsAction({
        category: currentCategory,
        sort: currentSort,
        page: nextPage,
        limit: 12,
      });
      setProducts(prev => [...prev, ...res.products]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(window.location.search);
    params.set("sort", newSort);
    // Reset to page 1 happens naturally as we push to the server route which unmounts this component
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 bg-white p-6 rounded-2xl border border-maroon-50 shadow-sm">
          <h2 className="font-heading font-bold text-lg mb-6 text-maroon-900">Filters</h2>
          <div className="space-y-8">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-maroon-800 mb-4">Categories</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href={`/products${currentSort ? `?sort=${currentSort}` : ''}`} className={!currentCategory ? "font-bold text-maroon-700" : "text-gray-600 hover:text-maroon-700 transition-colors"}>
                    All Categories
                  </Link>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link 
                      href={`/products?category=${cat.slug}${currentSort ? `&sort=${currentSort}` : ''}`} 
                      className={currentCategory === cat.slug ? "font-bold text-maroon-700" : "text-gray-600 hover:text-maroon-700 transition-colors"}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Sorting Filter */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-maroon-800 mb-4">Sort By</h3>
              <select 
                value={currentSort || "newest"} 
                onChange={handleSortChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-maroon-500 focus:border-maroon-500 block p-2.5 outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <div className="flex-1 flex flex-col">
        {products.length === 0 ? (
          <div className="text-center py-24 bg-maroon-50/50 rounded-2xl border border-dashed border-maroon-100">
            <h3 className="text-lg font-medium text-maroon-900">No products found</h3>
            <p className="text-maroon-700 mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                />
              ))}
            </div>

            {/* Load More Pagination */}
            <div className="flex flex-col items-center justify-center py-8">
              {hasMore ? (
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-maroon-700 hover:bg-maroon-800 text-white px-8 py-3 rounded-full font-medium transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Products"
                  )}
                </button>
              ) : (
                <p className="text-maroon-700 font-medium italic bg-maroon-50 px-6 py-3 rounded-full">
                  We showed our best till now ✨
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
