import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const steps = [
    { id: 1, name: "Address" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Confirmation" },
  ];

  return (
    <nav aria-label="Progress" className="w-full pb-10 pt-4">
      <ol role="list" className="flex items-center w-full relative">
        {steps.map((step, stepIdx) => {
          const isLast = stepIdx === steps.length - 1;
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.name}
              className={cn(
                "relative flex flex-col items-center",
                !isLast ? "flex-1" : ""
              )}
            >
              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-1 -translate-y-1/2 transition-colors duration-300",
                    isCompleted ? "bg-maroon-700" : "bg-gray-200"
                  )}
                  aria-hidden="true"
                />
              )}

              {/* Step Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 shadow-sm",
                  isCompleted
                    ? "bg-maroon-700"
                    : isCurrent
                    ? "border-[3px] border-maroon-700 bg-white"
                    : "border-2 border-gray-300 bg-white"
                )}
              >
                {isCompleted && <Check className="h-4 w-4 text-white" aria-hidden="true" />}
                <span className="sr-only">{step.name}</span>
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  "absolute -bottom-8 whitespace-nowrap text-sm font-semibold transition-colors duration-300",
                  isCompleted || isCurrent ? "text-maroon-900" : "text-gray-400"
                )}
              >
                {step.name}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
