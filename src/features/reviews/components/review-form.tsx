"use client";

import { useState } from "react";
import { createReview } from "../actions/review-actions";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Please enter a review comment.");
    
    setIsLoading(true);
    const res = await createReview({ productId, rating, title, comment });
    
    if (res.success) {
      toast.success("Review submitted successfully!");
      setComment("");
      setTitle("");
      setRating(5);
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
      <h3 className="font-bold text-lg">Write a Review</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Overall Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none transition-colors"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoverRating || rating)
                    ? "fill-gold-400 text-gold-400"
                    : "text-gray-300 dark:text-gray-700"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Review Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-maroon-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Your Review</label>
        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike?"
          className="w-full px-4 py-2 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-1 focus:ring-maroon-500"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-maroon-800 hover:bg-maroon-900 text-white font-medium rounded-lg transition-colors flex items-center justify-center min-w-[140px]"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Review"}
      </button>
    </form>
  );
}
