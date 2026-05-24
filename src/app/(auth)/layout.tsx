import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-maroon-700 dark:text-gray-400 dark:hover:text-maroon-400 transition-colors bg-white/50 dark:bg-gray-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Decorative Background */}
      <div className="absolute inset-0 bg-maroon-50 dark:bg-gray-950 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-maroon-300/30 dark:bg-maroon-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-gold-300/20 dark:bg-gold-900/10 rounded-full blur-3xl opacity-50" />
      </div>

      {children}
    </div>
  );
}
