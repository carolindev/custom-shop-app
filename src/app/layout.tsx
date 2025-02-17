
"use client"

import Header from "@/components/ui/Header";
import "@/styles/globals.css";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  
  return (
    <html lang="en">
      <head>
        <title>Sports Shop</title>
      </head>
      <body className="bg-gray-100 text-gray-900">
        {!isAdminPage && <Header />} {/* Show Header only for Storefront */}
        {children}
      </body>
    </html>
  );
}