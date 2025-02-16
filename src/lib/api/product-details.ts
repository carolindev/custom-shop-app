import { API_BASE_URL } from "@/config/config";
import { ProductData } from "@/types/products";

export async function fetchProductById(productId: string): Promise<ProductData> {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/products/${productId}`);

    if (!res.ok) {
      throw new Error("Failed to load product details.");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw new Error("Error fetching product details.");
  }
}