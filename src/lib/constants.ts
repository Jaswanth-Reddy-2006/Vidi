export const ORDER_STATUSES = [
  { value: "PLACED", label: "Placed", color: "blue" },
  { value: "CONFIRMED", label: "Confirmed", color: "indigo" },
  { value: "PACKED", label: "Packed", color: "orange" },
  { value: "SHIPPED", label: "Shipped", color: "purple" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery", color: "yellow" },
  { value: "DELIVERED", label: "Delivered", color: "green" },
  { value: "CANCELLED", label: "Cancelled", color: "red" },
  { value: "RETURNED", label: "Returned", color: "gray" },
];

export const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending", color: "yellow" },
  { value: "PAID", label: "Paid", color: "green" },
  { value: "FAILED", label: "Failed", color: "red" },
  { value: "REFUNDED", label: "Refunded", color: "gray" },
];

export const PAYMENT_METHODS = [
  { value: "RAZORPAY", label: "Online Payment (Razorpay)" },
  { value: "COD", label: "Cash on Delivery" },
];

export const PRODUCT_SORT_OPTIONS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
  { value: "rating", label: "Customer Rating" },
];

export const ITEMS_PER_PAGE = 12;

export const SAREE_FABRICS = [
  "Silk",
  "Cotton",
  "Banarasi",
  "Chiffon",
  "Georgette",
  "Linen",
  "Organza",
  "Kanjeevaram",
  "Tussar",
  "Crepe",
];

export const SAREE_OCCASIONS = [
  "Wedding",
  "Party",
  "Festive",
  "Casual",
  "Workwear",
  "Traditional",
];

export const SAREE_COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Maroon", hex: "#800020" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Gold", hex: "#d4af37" },
  { name: "Black", hex: "#18181b" },
  { name: "White", hex: "#ffffff" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Orange", hex: "#f97316" },
];
