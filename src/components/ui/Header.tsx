"use client";

import Link from "next/link";
import { FiShoppingCart, FiHome } from "react-icons/fi";
import { useCart } from "@/hooks/use-cart";

export default function Header() {
  const { cartItems } = useCart();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Home Link / Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FiHome className="text-primary" size={24} />
          MyShop
        </Link>

        {/* Cart Link */}
        <Link href="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-primary">
          <FiShoppingCart size={24} />
          <span className="hidden sm:inline">Cart</span>

          {/* Display Cart Item Count (Only if > 0) */}
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}