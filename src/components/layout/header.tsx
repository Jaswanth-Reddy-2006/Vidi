"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Silk Sarees", href: "/categories/silk-sarees" },
  { name: "Banarasi Sarees", href: "/categories/banarasi-sarees" },
  { name: "Cotton Sarees", href: "/categories/cotton-sarees" },
  { name: "Chiffon Sarees", href: "/categories/chiffon-sarees" },
  { name: "Georgette Sarees", href: "/categories/georgette-sarees" },
  { name: "Designer Sarees", href: "/categories/designer-sarees" },
  { name: "Wedding Collection", href: "/categories/wedding-collection" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  return (
    <>

      {/* Main Header */}
      <header className="relative z-50 bg-maroon-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-white hover:text-maroon-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 lg:gap-3 group"
            >
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm border border-maroon-100/20">
                <Image 
                  src="/logo.png" 
                  alt="Vidi Logo" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-3xl lg:text-4xl font-heading font-bold tracking-tight text-white transition-colors">
                Vidi
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
              <Link
                href="/"
                className="text-sm font-medium text-maroon-50 hover:text-white transition-colors"
              >
                Home
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-maroon-50 hover:text-white transition-colors">
                  Categories
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isCategoryOpen && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                    >
                      {categories.map((category) => (
                        <Link
                          key={category.href}
                          href={category.href}
                          className="block px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          href="/categories"
                          className="block px-4 py-2.5 text-sm font-medium text-maroon-800 hover:bg-maroon-50 transition-colors"
                        >
                          View All Categories →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/products?isNewArrival=true"
                className="text-sm font-medium text-maroon-50 hover:text-white transition-colors"
              >
                New Arrivals
              </Link>

              <Link
                href="/products?sort=popularity"
                className="text-sm font-medium text-maroon-50 hover:text-white transition-colors"
              >
                Best Sellers
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 text-white hover:bg-maroon-800 rounded-full transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2.5 text-white hover:bg-maroon-800 rounded-full transition-all relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2.5 text-white hover:bg-maroon-800 rounded-full transition-all relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {/* Cart count badge */}
                <span className="absolute -top-0.5 -right-0.5 bg-white text-maroon-700 text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                  0
                </span>
              </Link>

              {/* Profile / Auth */}
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2.5 text-white hover:bg-maroon-800 rounded-full transition-all"
                    aria-label="Profile menu"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {session.user.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {session.user.email}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 transition-colors sm:hidden"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          Wishlist
                        </Link>
                        {session.user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-maroon-700 bg-white hover:bg-maroon-50 rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white border-t border-maroon-800 text-maroon-700"
            >
              <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-maroon-300" />
                  <input
                    type="search"
                    placeholder="Search for sarees, fabrics, occasions..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-maroon-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 transition-all text-maroon-900 placeholder:text-maroon-300"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-maroon-100">
                <Link
                  href="/"
                  className="text-2xl font-heading font-bold text-maroon-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vidi
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-maroon-300 hover:text-maroon-700"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {session && (
                <div className="px-4 py-4 bg-maroon-50 border-b border-maroon-100">
                  <p className="font-semibold text-maroon-900">
                    {session.user.name}
                  </p>
                  <p className="text-sm text-maroon-600 mt-0.5">
                    {session.user.email}
                  </p>
                </div>
              )}

              <nav className="px-2 py-4">
                <Link
                  href="/"
                  className="block px-4 py-3 text-base font-medium text-maroon-800 hover:bg-maroon-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <div className="mt-2">
                  <p className="px-4 py-2 text-xs font-semibold text-maroon-400 uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-2.5 text-sm text-maroon-700 hover:bg-maroon-50 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/products?isNewArrival=true"
                  className="block px-4 py-3 mt-2 text-base font-medium text-maroon-800 hover:bg-maroon-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>

                <div className="border-t border-maroon-100 mt-4 pt-4">
                  {session ? (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-3 text-base text-maroon-700 hover:bg-maroon-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-3 text-base text-maroon-700 hover:bg-maroon-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-3 text-base text-maroon-700 hover:bg-maroon-50 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-base text-maroon-700 hover:bg-maroon-50 rounded-lg transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="px-4 space-y-2">
                      <Link
                        href="/login"
                        className="block w-full text-center py-3 text-sm font-medium text-white bg-maroon-700 hover:bg-maroon-800 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full text-center py-3 text-sm font-medium text-maroon-700 border border-maroon-200 hover:bg-maroon-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
