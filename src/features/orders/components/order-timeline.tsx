import { CheckCircle2, Circle, Clock, Package, Truck, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = 
  | "PLACED" 
  | "CONFIRMED" 
  | "PACKED" 
  | "SHIPPED" 
  | "OUT_FOR_DELIVERY" 
  | "DELIVERED" 
  | "CANCELLED" 
  | "RETURNED";

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: Date;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
}

const steps = [
  { id: "PLACED", label: "Order Placed", icon: Clock },
  { id: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { id: "PACKED", label: "Packed", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: CheckCircle },
];

export function OrderTimeline({ status, createdAt, deliveredAt, cancelledAt }: OrderTimelineProps) {
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center text-red-800">
        <h3 className="font-semibold text-lg mb-2">Order Cancelled</h3>
        <p className="text-sm">
          This order was cancelled on {cancelledAt ? new Date(cancelledAt).toLocaleDateString() : "unknown date"}.
        </p>
      </div>
    );
  }

  if (status === "RETURNED") {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-800">
        <h3 className="font-semibold text-lg mb-2">Order Returned</h3>
        <p className="text-sm">This order has been returned and refunded.</p>
      </div>
    );
  }

  // Determine current step index
  let currentIndex = 0;
  if (status === "DELIVERED") currentIndex = 4;
  else if (status === "OUT_FOR_DELIVERY") currentIndex = 3; // visually between shipped and delivered, but let's highlight shipped
  else if (status === "SHIPPED") currentIndex = 3;
  else if (status === "PACKED") currentIndex = 2;
  else if (status === "CONFIRMED") currentIndex = 1;
  else currentIndex = 0;

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-muted rounded-full"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 left-0 h-1 bg-maroon rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors duration-300",
                    isCompleted 
                      ? "bg-maroon text-white ring-4 ring-white" 
                      : "bg-muted text-muted-foreground ring-4 ring-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-xs sm:text-sm font-medium",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </p>
                  {index === 0 && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {new Date(createdAt).toLocaleDateString()}
                    </p>
                  )}
                  {index === 4 && deliveredAt && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                      {new Date(deliveredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
