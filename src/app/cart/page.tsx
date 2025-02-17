"use client";

import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, loading, error } = useCart();

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {loading && <p className="text-center text-gray-500">Loading cart items...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {cartItems.length === 0 && !loading && (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg">
        {cartItems.map((item) => (
          <div key={item.cartItemId} className="flex items-center gap-4 border-b py-4">
            {/* Product Image */}
            <Image
              src={item.productImage}
              alt={item.productName}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />

            {/* Product Details */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{item.productName}</h2>
              <p className="text-gray-500 text-sm">{item.label}</p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>

            {/* Go to Product Page */}
            <Link
              href={`/product/${item.productId}`}
              className="text-blue-500 hover:underline"
            >
              View Product
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}