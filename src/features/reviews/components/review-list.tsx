import { Star, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ReviewForm } from "./review-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function ReviewList({ productId }: { productId: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  
  const reviews = await prisma.review.findMany({
    where: { productId, isApproved: true },
    include: { user: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold font-heading">Customer Reviews</h2>
          
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">{averageRating}</div>
            <div className="space-y-1">
              <div className="flex items-center text-gold-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Number(averageRating) ? "fill-current" : "text-gray-300 dark:text-gray-700"}`} />
                ))}
              </div>
              <div className="text-sm text-gray-500">Based on {reviews.length} reviews</div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            {session ? (
              <ReviewForm productId={productId} />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to write a review.</p>
                <a href="/login" className="inline-block px-6 py-2 bg-maroon-800 hover:bg-maroon-900 text-white font-medium rounded-lg transition-colors">
                  Log In
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-gray-500">
              <Star className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-maroon-100 dark:bg-maroon-900/30 text-maroon-800 dark:text-maroon-400 flex items-center justify-center font-bold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {review.user.name}
                        {review.isVerified && (
                          <span className="flex items-center text-xs text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex text-gold-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"}`} />
                    ))}
                  </div>
                </div>
                {review.title && <h4 className="font-bold text-gray-900 dark:text-white mb-2">{review.title}</h4>}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
