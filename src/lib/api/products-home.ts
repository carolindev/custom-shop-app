import { ProductsResponse } from "@/types/products";
import { API_BASE_URL, PAGE_SIZE } from "@/config/config"; 

export async function fetchProducts(page = 1, size = PAGE_SIZE): Promise<ProductsResponse> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/v1/products?page=${page}&size=${size}`
    );

    if (!res.ok) {
      throw new Error("Failed to load products.");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products.");
  }
}