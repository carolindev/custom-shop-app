"use client";

import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/config";

interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  productImage: string;
  selectedOptions: { attributeId: number; optionId: number }[];
  quantity: number;
  label: string;
}

interface CartResponse {
  cartItems: CartItem[];
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCartItems() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/v1/cart/items`);

        if (!res.ok) {
          throw new Error("Failed to fetch cart items.");
        }

        const data: CartResponse = await res.json();
        setCartItems(data.cartItems);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchCartItems();
  }, []);

  return { cartItems, loading, error };
}