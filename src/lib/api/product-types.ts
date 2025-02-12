import { ProductType } from "@/types/product-types";

export async function fetchProductTypes(): Promise<ProductType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/product-types`, {
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