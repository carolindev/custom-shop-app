import { useEffect, useState } from "react";
import { fetchProductTypeDetails } from "@/lib/api/product-type-details";
import { ProductTypeData } from "@/types/product-types";

export function useProductTypeDetails(selectedProductTypeId: string | null) {
    const [productTypeDetails, setProductTypeDetails] = useState<ProductTypeData>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (!selectedProductTypeId) return;
  
      async function loadProductTypeDetails() {
        setLoading(true);
        try {
          const data = await fetchProductTypeDetails(selectedProductTypeId as string);
          setProductTypeDetails(data);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      }
      loadProductTypeDetails();
    }, [selectedProductTypeId]);
  
    return { productTypeDetails, loading, error };
  }