import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata = {
  title: "Create Account - Vidi",
  description: "Create a new Vidi account to discover premium sarees",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <RegisterForm />
    </div>
  );
}
