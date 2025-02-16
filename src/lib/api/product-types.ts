import { ProductType } from "@/types/product-types";
import { API_BASE_URL } from "@/config/config";

export async function fetchProductTypes(): Promise<ProductType[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/admin/product-types`, {
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch product types");

    const data = await res.json();
    return data.productTypes;
  } catch (error) {
    console.error("Error fetching product types:", error);
    return [];
  }
}