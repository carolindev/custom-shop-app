import { ProductAttributeAO } from "@/types/products";
import { API_BASE_URL } from "@/config/config";

export async function fetchAvailableOptions(
  productId: string,
  requestedAttributeId: number,
  selectedOptionIds: string
): Promise<ProductAttributeAO> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/v1/products/${productId}/available-options?requestedAttributeId=${requestedAttributeId}&selectedOptionIds=${selectedOptionIds}`
    );

    if (!res.ok) {
      throw new Error("Failed to load available options.");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching available options:", error);
    throw new Error("Error fetching available options.");
  }
}