import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign In - Vidi",
  description: "Sign in to your Vidi account to continue shopping",
};

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-maroon-700" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
