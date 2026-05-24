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
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
              "relative"
            )}
          >
            {step.id < currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-maroon-600" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-maroon-600 hover:bg-maroon-900">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-maroon-600">
                  {step.name}
                </span>
              </>
            ) : step.id === currentStep ? (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-maroon-600 bg-white"
                  aria-current="step"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-maroon-600"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-maroon-600">
                  {step.name}
                </span>
              </>
            ) : (
              <>
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-500">
                  {step.name}
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
