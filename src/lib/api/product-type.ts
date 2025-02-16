import { API_BASE_URL } from "@/config/config"; 

export async function createProductType(name: string, customisation: string) {
  const res = await fetch(`${API_BASE_URL}/v1/admin/product-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, config: { customisation } }),
  });

  if (!res.ok) throw new Error("Failed to create product type");

  return res.json();
}