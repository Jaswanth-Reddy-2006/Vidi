"use client";

import { useState } from "react";
import { MapPin, Truck, Loader2 } from "lucide-react";

export function PincodeEstimator() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; date?: string } | null>(null);

  const checkDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) return;
    
    setLoading(true);
    setResult(null);

    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Simple mock logic
    const today = new Date();
    const deliveryDays = pincode.startsWith("5") || pincode.startsWith("4") ? 3 : 5;
    today.setDate(today.getDate() + deliveryDays);
    
    setResult({
      message: `Delivery available to ${pincode}`,
      date: today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    });
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-5 rounded-2xl border border-gray-200 dark:border-gray-800 mb-8">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-gray-500" />
        <h4 className="font-semibold text-gray-900 dark:text-white">Check Delivery Estimate</h4>
      </div>
      
      <form onSubmit={checkDelivery} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-maroon-500 text-sm"
        />
        <button
          type="submit"
          disabled={pincode.length !== 6 || loading}
          className="px-6 py-2.5 bg-gray-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
        </button>
      </form>

      {result && (
        <div className="mt-3 flex items-start gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/30">
          <Truck className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">{result.message}</p>
            <p>Arriving by <span className="font-bold">{result.date}</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
