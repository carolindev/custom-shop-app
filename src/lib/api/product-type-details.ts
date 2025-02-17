import { API_BASE_URL } from "@/config/config"; 
import { ProductTypeData } from "@/types/product-types";

export async function fetchProductTypeDetails(productTypeId: string): Promise<ProductTypeData> {
    try {
      const res = await fetch(`${API_BASE_URL}/v1/admin/product-types/${productTypeId}`);
      if (!res.ok) throw new Error("Failed to fetch product type details.");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`Error fetching details for product type ${productTypeId}:`, err);
      throw err;
    }
  }