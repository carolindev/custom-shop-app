"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/config/config";

interface AddToCartResult {
  addToCart: (productId: string, selectedOptions: Record<number, number>, quantity?: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useAddToCart(): AddToCartResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Call POST /v1/cart/items with body:
   * {
   *   "productId": "12345",
   *   "selectedOptions": [
   *     { "attributeId": 6, "optionId": 14 },
   *     ...
   *   ],
   *   "quantity": 1
   * }
   */
  async function addToCart(productId: string, selectedOptions: Record<number, number>, quantity = 1) {
    setLoading(true);
    setError(null);

    try {
      // Convert selectedOptions (object) to an array of { attributeId, optionId }
      const optionsArray = Object.entries(selectedOptions).map(([attrId, optId]) => ({
        attributeId: Number(attrId),
        optionId: Number(optId),
      }));

      const res = await fetch(`${API_BASE_URL}/v1/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          selectedOptions: optionsArray,
          quantity,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error adding to cart: ${text}`);
      }
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { addToCart, loading, error };
}