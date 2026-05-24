import { NavItem } from "@/types";

export const customerNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { 
    label: "Categories", 
    href: "/categories",
    children: [
      { label: "Silk Sarees", href: "/categories/silk-sarees" },
      { label: "Cotton Sarees", href: "/categories/cotton-sarees" },
      { label: "Banarasi Sarees", href: "/categories/banarasi-sarees" },
      { label: "Chiffon Sarees", href: "/categories/chiffon-sarees" },
      { label: "Georgette Sarees", href: "/categories/georgette-sarees" },
      { label: "Designer Sarees", href: "/categories/designer-sarees" },
      { label: "Wedding Collection", href: "/categories/wedding-collection" },
    ]
  },
  { label: "New Arrivals", href: "/products?isNewArrival=true" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/products?sort=sale" },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "layout-dashboard" },
  { label: "Products", href: "/admin/products", icon: "shopping-bag" },
  { label: "Orders", href: "/admin/orders", icon: "package" },
  { label: "Customers", href: "/admin/customers", icon: "users" },
  { label: "Coupons", href: "/admin/coupons", icon: "ticket" },
  { label: "Banners", href: "/admin/banners", icon: "image" },
  { label: "Analytics", href: "/admin/analytics", icon: "bar-chart-3" },
  { label: "Reviews", href: "/admin/reviews", icon: "star" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];
