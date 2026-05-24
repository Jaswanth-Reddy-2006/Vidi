"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, CreditCard, Banknote, IndianRupee } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Sarees", href: "/products" },
    { label: "New Arrivals", href: "/products?isNewArrival=true" },
    { label: "Silk Sarees", href: "/categories/silk-sarees" },
    { label: "Cotton Sarees", href: "/categories/cotton-sarees" },
    { label: "Banarasi Sarees", href: "/categories/banarasi-sarees" },
    { label: "Wedding Collection", href: "/categories/wedding-collection" },
  ],
  customerService: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  account: [
    { label: "My Account", href: "/profile" },
    { label: "My Orders", href: "/orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Track Order", href: "/orders/track" },
  ],
};

export function Footer() {
  const pathname = usePathname();

  return (
    <footer className="bg-maroon-700 text-white">
      {/* Newsletter Section */}
      {pathname === "/" && (
        <div className="border-b border-maroon-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-heading font-bold text-white">
                Stay Updated with Vidi
              </h3>
              <p className="text-sm text-maroon-100 mt-1">
                Subscribe for exclusive offers, new arrivals, and style inspiration.
              </p>
            </div>
            <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                suppressHydrationWarning
                className="flex-1 px-4 py-3 bg-white border border-maroon-600 rounded-lg text-sm text-maroon-900 placeholder:text-maroon-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white transition-all"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="px-6 py-3 bg-white hover:bg-maroon-50 text-maroon-700 text-sm font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-heading font-bold text-white">
                Vidi
              </span>
            </Link>
            <p className="mt-4 text-sm text-maroon-100 leading-relaxed max-w-xs">
              Discover the finest collection of handcrafted sarees from across India.
              Every saree tells a story of tradition, artistry, and elegance.
            </p>
            <div className="mt-6 space-y-3">
              <a href="mailto:hello@vidi.store" className="flex items-center gap-3 text-sm text-maroon-100 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-white" />
                hello@vidi.store
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-maroon-100 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-white" />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-3 text-sm text-maroon-100">
                <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                Hyderabad, Telangana, India
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-maroon-100 hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Service
            </h4>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-maroon-100 hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              My Account
            </h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-maroon-100 hover:text-white transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Badges */}
            <div className="mt-8">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
                We Accept
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-7 bg-white rounded text-maroon-700 hover:bg-maroon-50 transition-colors" title="Visa">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-center w-10 h-7 bg-white rounded text-maroon-700 hover:bg-maroon-50 transition-colors" title="Mastercard">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-center w-10 h-7 bg-white rounded text-maroon-700 hover:bg-maroon-50 transition-colors" title="UPI">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-center w-10 h-7 bg-white rounded text-maroon-700 hover:bg-maroon-50 transition-colors" title="COD">
                  <Banknote className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-maroon-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-maroon-100">
              © {new Date().getFullYear()} Vidi. All rights reserved. Crafted with ❤️ in India.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="text-xs text-maroon-100 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-maroon-100 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/sitemap.xml" className="text-xs text-maroon-100 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
