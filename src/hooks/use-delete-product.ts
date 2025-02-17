"use client"; // Because we'll call fetch in client-side code

import { useState } from "react";
import { API_BASE_URL } from "@/config/config";

export function useDeleteProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeleteRequest(productId: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error deleting product: ${text}`);
      }

      // No return data, means success
    } catch (err) {
      setError((err as Error).message);
      throw err; // re-throw so the component knows
    } finally {
      setLoading(false);
    }
  }

  return { handleDeleteRequest, loading, error };
}