import { useEffect, useState } from "react";
import { fetchProductTypes } from "@/lib/api/product-types";
import {ProductType} from "@/types/product-types";

export function useProductTypes() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProductTypes() {
      setLoading(true);
      try {
        const data = await fetchProductTypes();
        setProductTypes(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadProductTypes();
  }, []);

  return { productTypes, loading, error };
}