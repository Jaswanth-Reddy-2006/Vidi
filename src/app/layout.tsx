import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { Agentation } from "agentation";
import "./globals.css";

import { AppProviders } from "@/components/providers/app-providers";
import { ClientLayout } from "@/components/layout/client-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Vidi",
    default: "Vidi - Premium Saree Shopping",
  },
  description: "Enterprise-grade AI-assisted ecommerce platform for premium, handcrafted sarees including Kanjivaram, Banarasi, and Chiffon.",
  keywords: ["sarees", "premium sarees", "silk sarees", "indian ethnic wear", "online saree shopping"],
  authors: [{ name: "Vidi Admin" }],
  openGraph: {
    title: "Vidi - Premium Saree Shopping",
    description: "Discover our exclusive collection of handcrafted premium sarees.",
    url: "https://vidi.store",
    siteName: "Vidi",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610189014163-54942dcfbba2?q=80&w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Vidi Premium Sarees",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidi - Premium Saree Shopping",
    description: "Discover our exclusive collection of handcrafted premium sarees.",
    images: ["https://images.unsplash.com/photo-1610189014163-54942dcfbba2?q=80&w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AppProviders>
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster position="top-center" />
          {process.env.NODE_ENV === "development" && (
            <Agentation endpoint="http://localhost:4747" />
          )}
        </AppProviders>
      </body>
    </html>
  );
}
